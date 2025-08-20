import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import inquirer from 'inquirer';

function displayWelcome() {
    console.log(
        gradient.pastel(
            figlet.textSync('Cyber-Zakalka', { horizontalLayout: 'full' })
        )
    );
    console.log(chalk.yellow.bold('Добро пожаловать в "Кибер-закалку"!\n'));
    console.log(
        chalk.cyan(
            'Твой наставник, Дед, выбьет из тебя всю дурь и сделает настоящим бойцом.\n'
        )
    );
}

function displayProgress(levelManifest, completedLevels) {
    const completedSet = new Set(completedLevels);
    let output = '';

    levelManifest.blocks.forEach((block) => {
        const total = block.levels.length;
        if (total === 0) return;

        const completed = block.levels.filter((level) =>
            completedSet.has(level.id)
        ).length;
        const percentage = Math.round((completed / total) * 100);

        const barWidth = 20;
        const filledLength = Math.round(barWidth * (completed / total));
        const emptyLength = barWidth - filledLength;

        const bar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);
        const title = `${block.title}:`.padEnd(25, ' ');

        output += `${chalk.yellow(title)} [${bar}] ${percentage}%\n`;
    });

    console.log(
        boxen(output.trim(), {
            title: 'НАВЫКИ БОЙЦА',
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'gray',
        })
    );
}

function displayLevelSelection(levelManifest, completedLevels, unlockedSecretLevels) {
    const completedSet = new Set(completedLevels);
    const unlockedSet = new Set(unlockedSecretLevels);

    const choices = levelManifest.blocks
        .filter(block => !block.secret || block.levels.some(l => unlockedSet.has(l.id)))
        .flatMap((block) => {
            const blockLevels = block.levels
                .filter(level => !block.secret || unlockedSet.has(level.id))
                .map((level) => ({
                    name: `${completedSet.has(level.id) ? '✅' : '🔲'} ${level.id}. ${level.title}`,
                    value: level.id,
                    disabled: !completedSet.has(level.id) && !unlockedSet.has(level.id) && ![...completedSet].includes(level.id - 1)
                }));

            if (blockLevels.length === 0) return [];

            const separator = block.secret 
                ? `---  SECRET: ${block.title} ---`
                : `--- ${block.title} ---`;

            return [new inquirer.Separator(separator), ...blockLevels];
        });

    return inquirer.prompt([
        {
            type: 'list',
            name: 'level',
            message: 'Выбери уровень, на который хочешь вернуться:',
            choices: choices,
            pageSize: 15,
        },
    ]);
}

export { displayWelcome, displayProgress, displayLevelSelection };