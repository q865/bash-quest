import fs from 'fs';
import path from 'path';

async function deleteFile(args, targetPath) {
    const finalPath = path.resolve(targetPath, args.path);
    if (fs.existsSync(finalPath)) {
        fs.unlinkSync(finalPath);
    }
}

export default deleteFile;
