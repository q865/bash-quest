import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// This is a simplified dynamic import for actions within the validator.
// In a real-world scenario, you'd likely have a more robust action loader.
async function runActions(actions, targetPath, actionHandlers) {
    if (!actions) return;
    for (const action of actions) {
        const handler = actionHandlers[action.action];
        if (handler) {
            await handler(action.args, targetPath);
        }
    }
}

async function scriptProducesOutput(args, M_PATH, state, actionHandlers) {
    const scriptPath = path.resolve(process.cwd(), args.script_path);

    if (!fs.existsSync(scriptPath)) {
        return {
            success: false,
            message: `Скрипт ${args.script_path} не найден, боец.`,
        };
    }

    // Make sure script is executable
    fs.chmodSync(scriptPath, '755');

    // Run setup actions if they exist
    await runActions(args.setup_actions, process.cwd(), actionHandlers);

    const promise = new Promise((resolve) => {
        exec(scriptPath, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    success: false,
                    message: `Скрипт упал с ошибкой: ${error.message}`,
                });
                return;
            }
            const output = stdout.trim();
            if (output === args.expected_output) {
                resolve({ success: true });
            } else {
                resolve({
                    success: false,
                    message: `Скрипт выдал "${output}", а Дед ожидал "${args.expected_output}".`,
                });
            }
        });
    });

    const result = await promise;

    // Run cleanup actions if they exist
    await runActions(args.cleanup_actions, process.cwd(), actionHandlers);

    return result;
}

export default scriptProducesOutput;
