import fs from 'fs';
import path from 'path';

/**
 * Проверяет, существует ли файл.
 * @param {object} args - Аргументы для валидатора.
 * @param {string} args.path - Путь к файлу.
 * @param {string} M_PATH - Модифицированный путь (абсолютный).
 * @returns {object} - Результат валидации.
 */
export default async function fileExists(args, M_PATH) {
    const filePath = M_PATH || path.join(process.cwd(), args.path);
    
    if (fs.existsSync(filePath)) {
        return { success: true };
    } else {
        return { success: false, message: `Ожидался файл по пути ${args.path}, но его там нет.` };
    }
}
