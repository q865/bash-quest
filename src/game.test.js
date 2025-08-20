
import { jest } from '@jest/globals';
import Game from './game.js';
import fs from 'fs';

describe('Game Logic', () => {
    let game;

    beforeEach(() => {
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {});
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
        jest.spyOn(fs, 'existsSync').mockImplementation(() => {});
        jest.spyOn(fs, 'readdirSync').mockImplementation(() => []);
        jest.clearAllMocks();


        // Mock the level manifest file
        const levelManifest = {
            blocks: [
                {
                    title: 'Block 1',
                    levels: [
                        { id: 1, title: 'Level 1', path: 'src/levels/level1' },
                        { id: 2, title: 'Level 2', path: 'src/levels/level2' },
                        { id: 50, title: 'Level 50', path: 'src/levels/level50' }
                    ]
                }
            ]
        };
        fs.readFileSync.mockReturnValue(JSON.stringify(levelManifest));

        // Mock the state file not existing initially
        fs.existsSync.mockReturnValue(false);

        game = new Game();
        // Clear the initial writeFileSync call from the constructor
        fs.writeFileSync.mockClear();
    });

    test('should initialize with the first level', () => {
        expect(game.state.currentLevel).toBe(1);
        expect(game.state.completedLevels).toEqual([]);
    });

    test('should save and load state correctly', () => {
        const stateToSave = { currentLevel: 2, completedLevels: [1] };
        fs.existsSync.mockReturnValue(true);
        
        // Mock reading the level manifest first, then the state file
        const levelManifest = { blocks: [{ levels: [{ id: 1 }, { id: 2 }] }] };
        fs.readFileSync
            .mockReturnValueOnce(JSON.stringify(levelManifest))
            .mockReturnValueOnce(JSON.stringify(stateToSave));

        const newGame = new Game();
        expect(newGame.state.currentLevel).toBe(2);
        expect(newGame.state.completedLevels).toEqual([1]);

        newGame.saveState();
        expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify(newGame.state, null, 2));
    });

    test('should reset the game state', () => {
        game.state.currentLevel = 50;
        game.state.completedLevels = [1, 2];
        game.reset();
        expect(game.state.currentLevel).toBe(1);
        expect(game.state.completedLevels).toEqual([]);
        expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('should set a specific level', () => {
        game.setLevel(50);
        expect(game.state.currentLevel).toBe(50);
        expect(fs.writeFileSync).toHaveBeenCalled();

        // Try setting a non-existent level
        game.setLevel(999);
        expect(game.state.currentLevel).toBe(50); // Should not change
    });

    // More tests for checkSolution will be added here
});
