import fs from 'fs';
import path from 'path';

export default async function createDirectory(args, projectRoot) {
    const dirPath = path.join(projectRoot, args.path);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
