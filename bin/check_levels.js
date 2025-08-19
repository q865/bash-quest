#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const levelsFile = path.resolve(rootDir, 'src', 'levels.json');

function checkLevels() {
    console.log('🔍 Начинаю проверку структуры уровней...');

    let levelsData;
    try {
        const rawData = fs.readFileSync(levelsFile, 'utf-8');
        levelsData = JSON.parse(rawData);
    } catch (error) {
        console.error(`❌ Ошибка чтения или парсинга файла ${levelsFile}:`, error);
        process.exit(1);
    }

    const blocks = levelsData.blocks;
    if (!blocks || !Array.isArray(blocks)) {
        console.error(`❌ Файл ${levelsFile} должен содержать массив 'blocks'.`);
        process.exit(1);
    }

    let errorCount = 0;

    for (const block of blocks) {
        console.log(`
🔎 Проверяю блок: "${block.title}"`);
        if (!block.levels || !Array.isArray(block.levels)) {
            console.error(`  ❌ У блока "${block.title}" отсутствует или некорректен массив 'levels'.`);
            errorCount++;
            continue;
        }

        for (const level of block.levels) {
            if (!level.id || !level.title || !level.path) {
                console.error(`  ❌ Некорректная запись уровня: ${JSON.stringify(level)}`);
                errorCount++;
                continue;
            }

            const levelPath = path.resolve(rootDir, level.path);
            
            if (!fs.existsSync(levelPath)) {
                console.error(`  ❌ Директория для уровня ${level.id} ("${level.title}") не найдена по пути: ${levelPath}`);
                errorCount++;
                continue;
            }

            const levelJsonPath = path.join(levelPath, 'level.json');
            if (!fs.existsSync(levelJsonPath)) {
                console.error(`  ❌ Файл level.json для уровня ${level.id} не найден в: ${levelPath}`);
                errorCount++;
            }

            const taskMdPath = path.join(levelPath, 'task.md');
            if (!fs.existsSync(taskMdPath)) {
                console.error(`  ❌ Файл task.md для уровня ${level.id} не найден в: ${levelPath}`);
                errorCount++;
            }
            
            if (errorCount === 0) {
                 console.log(`  ✅ Уровень ${level.id} ("${level.title}") в порядке.`);
            }
        }
    }

    if (errorCount > 0) {
        console.error(`

❌ Найдено ошибок: ${errorCount}.`);
        process.exit(1);
    } else {
        console.log('\n\n✅ Все уровни прошли проверку! Структура в порядке.');
    }
}

checkLevels();
