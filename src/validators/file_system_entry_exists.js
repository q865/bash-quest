import fs from 'fs';

/**
 * Проверяет, существует ли файл или директория.
 * @param {object} args - Аргументы для валидатора.
 * @param {string} args.path - Путь к файлу или директории.
 * @param {boolean} [args.shouldExist=true] - Должен ли существовать.
 * @param {string} M_PATH - Абсолютный путь к файлу.
 * @returns {object} - Результат валидации.
 */
export default async function fileSystemEntryExists(args, M_PATH) {
    const { path: entryPath, shouldExist = true } = args;
    const exists = fs.existsSync(M_PATH);

    if (shouldExist && !exists) {
        return { success: false, message: `Ожидалось, что '${entryPath}' будет существовать, но Дед его не нашёл.` };
    }

    if (!shouldExist && exists) {
        return { success: false, message: `А хули '${entryPath}' всё ещё на месте? Удали его, салага!` };
    }

    return { success: true };
}