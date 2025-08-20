import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export default async function processNotRunning(args) {
    try {
        const { stdout } = await execAsync(`pgrep -f "${args.process}"`);
        if (stdout.trim()) {
            return {
                success: false,
                message: `Процесс "${args.process}" всё ещё запущен.`,
            };
        }
        return { success: true };
    } catch (error) {
        // Команда pgrep завершается с ошибкой, если ничего не найдено
        return { success: true };
    }
}
