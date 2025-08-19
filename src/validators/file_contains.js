import fs from 'fs';

async function fileContains(args, M_PATH) {
    const filePath = M_PATH;
    if (!fs.existsSync(filePath)) {
        return { success: false, message: `Файл ${args.path} не найден. Дед негодует.` };
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(args.content)) {
        return { success: true };
    }
    return { success: false, message: `В файле ${args.path} нет нужного содержимого. Дед советует перепроверить.` };
}

export default fileContains;
