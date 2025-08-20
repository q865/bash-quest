import fs from 'fs';

/**
 * Проверяет, содержит ли файл определённый контент.
 * @param {object} args - Аргументы для валидатора.
 * @param {string} args.path - Путь к файлу.
 * @param {string} args.content - Ожидаемый контент.
 * @param {boolean} [args.shouldContain=true] - Должен ли файл содержать контент.
 * @param {string} M_PATH - Абсолютный путь к файлу.
 * @returns {object} - Результат валидации.
 */
export default async function fileContentMatches(args, M_PATH) {
    const { path: filePathArg, content, shouldContain = true } = args;

    if (!fs.existsSync(M_PATH)) {
        return { success: false, message: `Файл '${filePathArg}' не найден. Ты вообще его создавал?` };
    }

    const fileContent = fs.readFileSync(M_PATH, 'utf-8');
    const contains = fileContent.includes(content);

    if (shouldContain) {
        if (fileContent.length === 0) {
            return { success: false, message: `Файл '${filePathArg}' пустой, как твоя голова. Дед ожидал там увидеть кое-что.` };
        }
        if (!contains) {
            return { success: false, message: `В файле '${filePathArg}' какая-то хуйня, но не то, что нужно. Ищи ошибку в содержании.` };
        }
    }

    if (!shouldContain && contains) {
        return { success: false, message: `В файле '${filePathArg}' нашлось лишнее: "${content}". Дед недоволен.` };
    }

    return { success: true };
}