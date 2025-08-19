import fs from 'fs';
import path from 'path';

async function fileNotContains(args, M_PATH) {
    const filePath = M_PATH;
    if (!fs.existsSync(filePath)) {
        return { success: false, message: `Дед не видит файла по пути: ${args.path}. Ищи ошибку.` };
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(args.content)) {
        return { success: false, message: `В файле ${args.path} нашлось лишнее: "${args.content}". Дед недоволен.` };
    }
    return { success: true };
}

export default fileNotContains;
