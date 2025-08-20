import fs from 'fs';
import path from 'path';

async function fileMatchesRegex(args, M_PATH) {
    const filePath = M_PATH;
    if (!fs.existsSync(filePath)) {
        return {
            success: false,
            message: `Дед не видит файла по пути: ${args.path}. Ищи ошибку.`,
        };
    }
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    const regex = new RegExp(args.regex);

    if (regex.test(content)) {
        return { success: true };
    }
    return {
        success: false,
        message: `Содержимое файла ${args.path} не похоже на то, что ожидает Дед. Он ждал что-то вроде '${args.regex}', а получил '${content}'.`,
    };
}

export default fileMatchesRegex;
