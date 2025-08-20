import { exec } from 'child_process';

async function commandSucceeds(args) {
    return new Promise((resolve) => {
        exec(args.command, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    success: false,
                    message: `Команда провалилась, боец. Дед ворчит: ${error.message}`,
                });
                return;
            }
            resolve({ success: true });
        });
    });
}

export default commandSucceeds;
