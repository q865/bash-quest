import { spawn } from 'child_process';

export default async function runBackgroundProcess(args, projectRoot) {
    const [command, ...commandArgs] = args.command.split(' ');
    const subprocess = spawn(command, commandArgs, {
        cwd: projectRoot,
        detached: true,
        stdio: 'ignore',
    });
    subprocess.unref();
}
