import fs from 'fs';
import path from 'path';

async function createFile(args, targetPath) {
    const finalPath = path.resolve(targetPath, args.path);
    const dir = path.dirname(finalPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(finalPath, args.content || '');
}

export default createFile;
