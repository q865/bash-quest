import fs from 'fs';

async function fileExists(args, M_PATH) {
    const filePath = M_PATH;
    if (fs.existsSync(filePath)) {
        return { success: true };
    }
    return { success: false, message: `Дед не видит файла по пути: ${args.path}. Ищи ошибку.` };
}

export default fileExists;
