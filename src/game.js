import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const STATE_FILE = path.join(PROJECT_ROOT, '.bash_quest_state.json');
const LEVELS_FILE = path.resolve(__dirname, 'levels.json');
const VALIDATORS_DIR = path.resolve(__dirname, 'validators');
const ACTIONS_DIR = path.resolve(__dirname, 'actions');

const secretCodes = {
    ded_rules_1337: 51,
    // Add more codes for other secret levels here
};

class Game {
    constructor() {
        this.levelManifest = this.loadLevelManifest();
        this.levels = this.levelManifest.blocks.flatMap(
            (block) => block.levels
        );
        this.state = this.loadState();
        this.validators = {};
        this.actions = {};
        this.loadValidators();
        this.loadActions();
    }

    async loadValidators() {
        const validatorFiles = fs
            .readdirSync(VALIDATORS_DIR)
            .filter((file) => file.endsWith('.js'));
        for (const file of validatorFiles) {
            const validatorName = path.basename(file, '.js');
            const validatorPath = path.join(VALIDATORS_DIR, file);
            const { default: validatorFunc } = await import(
                pathToFileURL(validatorPath).href
            );
            this.validators[validatorName] = validatorFunc;
        }
    }

    async loadActions() {
        const actionFiles = fs
            .readdirSync(ACTIONS_DIR)
            .filter((file) => file.endsWith('.js'));
        for (const file of actionFiles) {
            const actionName = path.basename(file, '.js');
            const actionPath = path.join(ACTIONS_DIR, file);
            const { default: actionFunc } = await import(
                pathToFileURL(actionPath).href
            );
            this.actions[actionName] = actionFunc;
        }
    }

    loadLevelManifest() {
        const data = fs.readFileSync(LEVELS_FILE, 'utf-8');
        return JSON.parse(data);
    }

    loadState() {
        const firstLevel = this.levels.length > 0 ? this.levels[0].id : 1;
        const defaultState = {
            currentLevel: firstLevel,
            completedLevels: [],
            hintRequests: {},
            unlockedSecretLevels: [],
        };

        if (fs.existsSync(STATE_FILE)) {
            const data = fs.readFileSync(STATE_FILE, 'utf-8');
            const loadedState = JSON.parse(data);
            return { ...defaultState, ...loadedState };
        }

        return defaultState;
    }

    saveState() {
        fs.writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2));
    }

    getCurrentLevel() {
        return this.levels.find((l) => l.id === this.state.currentLevel);
    }

    loadLevelData(levelId) {
        const levelInfo = this.levels.find((l) => l.id === levelId);
        if (!levelInfo) return null;
        const levelFile = path.resolve(
            __dirname,
            '..',
            levelInfo.path,
            'level.json'
        );
        if (fs.existsSync(levelFile)) {
            return JSON.parse(fs.readFileSync(levelFile, 'utf-8'));
        }
        return null;
    }

    async runActions(actionType) {
        const levelData = this.loadLevelData(this.state.currentLevel);
        const actionList = levelData ? levelData[actionType] : null;
        if (!actionList || !Array.isArray(actionList)) return;

        for (const action of actionList) {
            const actionHandler = this.actions[action.action];
            if (actionHandler) {
                await actionHandler(action.args, PROJECT_ROOT);
            } else {
                console.error(`Unknown action type: ${action.action}`);
            }
        }
    }

    async getTask() {
        await this.runActions('setup');
        const level = this.getCurrentLevel();
        if (!level) {
            return { isComplete: true };
        }

        const levelData = this.loadLevelData(this.state.currentLevel);
        const title = levelData?.title || level.title;

        const taskFile = path.resolve(__dirname, '..', level.path, 'task.md');
        let taskText;

        if (fs.existsSync(taskFile)) {
            taskText = fs.readFileSync(taskFile, 'utf-8');
        } else {
            taskText = 'Текст задания для этого уровня еще не написан Дедом.';
        }

        return {
            name: title,
            task: taskText,
            isComplete: false,
        };
    }

    getHint() {
        const levelData = this.loadLevelData(this.state.currentLevel);
        if (!levelData) return 'Нет данных для этого уровня.';

        const levelId = this.state.currentLevel;
        const hintCount = this.state.hintRequests[levelId] || 0;

        let hint;
        if (hintCount === 0) {
            hint = levelData.hint || 'Подсказок для этого уровня нет.';
        } else {
            hint =
                levelData.hint2 ||
                levelData.hint ||
                'Больше подсказок нет, салага. Думай сам.';
        }

        // Increment hint request count for the current level
        this.state.hintRequests[levelId] = hintCount + 1;
        this.saveState();

        return hint;
    }

    async checkSolution() {
        const levelData = this.loadLevelData(this.state.currentLevel);
        if (!levelData || !levelData.validation) {
            return {
                success: false,
                message: 'Не удалось загрузить проверку для этого уровня.',
            };
        }

        const validations = Array.isArray(levelData.validation)
            ? levelData.validation
            : [levelData.validation];

        for (const validation of validations) {
            const validator = this.validators[validation.validator];
            if (!validator) {
                return {
                    success: false,
                    message: `Неизвестный тип проверки: ${validation.validator}`,
                };
            }

            const M_PATH = validation.args.path
                ? path.join(PROJECT_ROOT, validation.args.path)
                : null;
            const result = await validator(
                validation.args,
                M_PATH,
                this.state,
                this.actions
            );

            if (!result.success) {
                return {
                    success: false,
                    message: result.message || 'Решение неверное.',
                };
            }
        }

        await this.runActions('cleanup');

        if (!this.state.completedLevels.includes(this.state.currentLevel)) {
            this.state.completedLevels.push(this.state.currentLevel);
        }

        const currentLevelIndex = this.levels.findIndex(
            (l) => l.id === this.state.currentLevel
        );
        const nextLevel = this.levels[currentLevelIndex + 1];

        if (nextLevel) {
            this.state.currentLevel = nextLevel.id;
            this.saveState();
            return { success: true };
        } else {
            this.saveState();
            return { success: true, isComplete: true };
        }
    }

    reset() {
        this.state = {
            currentLevel: this.levels[0].id,
            completedLevels: [],
            hintRequests: {},
            unlockedSecretLevels: [],
        };
        this.saveState();
        // Add cleanup logic here later
    }

    setLevel(levelId) {
        const levelIndex = this.levels.findIndex((l) => l.id === levelId);
        if (levelIndex !== -1) {
            this.state.currentLevel = this.levels[levelIndex].id;
            this.saveState();
        }
    }

    unlockSecretLevel(code) {
        const levelId = secretCodes[code];
        if (levelId && !this.state.unlockedSecretLevels.includes(levelId)) {
            this.state.unlockedSecretLevels.push(levelId);
            this.saveState();
            const level = this.levels.find(l => l.id === levelId);
            return { success: true, message: `Открыт секретный уровень: "${level.title}"!` };
        }
        return { success: false, message: 'Неверный код или уровень уже открыт.' };
    }
}

export default Game;