import fs from 'fs';
import path from 'path';

async function fileHasContent(args, M_PATH) {
    const filePath = M_PATH;
    if (!fs.existsSync(filePath)) {
        return { success: false, message: `Дед не видит файла по пути: ${args.path}. Ищи ошибку.` };
    }
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    const minLength = args.min_length || 1;

    if (content.length >= minLength) {
        return { success: true };
    }
    return { success: false, message: `Файл ${args.path} слишком пустой. Дед ожидал там хотя бы ${minLength} символов.` };
}

export default fileHasContent;
