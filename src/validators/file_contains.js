import fs from 'fs';
import path from 'path';

/**
 * Проверяет, содержит ли файл определённый контент.
 * @param {object} args - Аргументы для валидатора.
 * @param {string} args.path - Путь к файлу.
 * @param {string} args.content - Ожидаемый контент.
 * @param {string} M_PATH - Модифицированный путь (абсолютный).
 * @returns {object} - Результат валидации.
 */
export default async function fileContains(args, M_PATH) {
    const filePath = M_PATH || path.join(process.cwd(), args.path);

    // --- DEBUGGING START ---
    console.log(`[DEBUG] Checking for file at: ${filePath}`);
    // --- DEBUGGING END ---

    if (!fs.existsSync(filePath)) {
        // --- DEBUGGING START ---
        console.log(`[DEBUG] File not found.`);
        // --- DEBUGGING END ---
        return { success: false, message: `Файл ${args.path} не найден.` };
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // --- DEBUGGING START ---
    console.log(`[DEBUG] File content:
---
${fileContent}
---
`);
    console.log(`[DEBUG] Searching for: "${args.content}"`);
    // --- DEBUGGING END ---

    if (fileContent.includes(args.content)) {
        // --- DEBUGGING START ---
        console.log(`[DEBUG] Content found!`);
        // --- DEBUGGING END ---
        return { success: true };
    } else {
        // --- DEBUGGING START ---
        console.log(`[DEBUG] Content NOT found.`);
        // --- DEBUGGING END ---
        return { success: false, message: `Файл ${args.path} не содержит ожидаемую строку: "${args.content}".` };
    }
}
