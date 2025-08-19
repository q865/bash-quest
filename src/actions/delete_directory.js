import fs from 'fs';
import path from 'path';

async function deleteDirectory(args, targetPath) {
    const finalPath = path.resolve(targetPath, args.path);
    if (fs.existsSync(finalPath)) {
        fs.rmSync(finalPath, { recursive: true, force: true });
    }
}

export default deleteDirectory;
