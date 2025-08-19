import fs from 'fs';
import path from 'path';

async function fileNotExists(args, M_PATH) {
    const filePath = M_PATH;
    if (fs.existsSync(filePath)) {
        return { success: false, message: `А хули файл ${args.path} всё ещё на месте? Удали его!` };
    }
    return { success: true };
}

export default fileNotExists;
