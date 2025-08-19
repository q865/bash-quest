import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';

function displayWelcome() {
    console.log(gradient.pastel(figlet.textSync('Cyber-Zakalka', { horizontalLayout: 'full' })));
    console.log(chalk.yellow.bold('Добро пожаловать в "Кибер-закалку"!\n'));
    console.log(chalk.cyan('Твой наставник, Дед, выбьет из тебя всю дурь и сделает настоящим бойцом.\n'));
}

function displayProgress(levelManifest, completedLevels) {
    const completedSet = new Set(completedLevels);
    let output = '';

    levelManifest.blocks.forEach(block => {
        const total = block.levels.length;
        if (total === 0) return;

        const completed = block.levels.filter(level => completedSet.has(level.id)).length;
        const percentage = Math.round((completed / total) * 100);
        
        const barWidth = 20;
        const filledLength = Math.round(barWidth * (completed / total));
        const emptyLength = barWidth - filledLength;
        
        const bar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);
        const title = `${block.title}:`.padEnd(25, ' ');
        
        output += `${chalk.yellow(title)} [${bar}] ${percentage}%\n`;
    });

    console.log(boxen(output.trim(), { 
        title: 'НАВЫКИ БОЙЦА',
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'gray'
    }));
}

export { displayWelcome, displayProgress };


