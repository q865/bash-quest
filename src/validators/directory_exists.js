import fs from 'fs';

async function directoryExists(args, M_PATH) {
    const dirPath = M_PATH;
    if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
        return { success: true };
    }
    return { success: false, message: `Дед не нашел директорию: ${args.path}. Попробуй еще.` };
}

export default directoryExists;
