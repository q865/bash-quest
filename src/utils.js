import chalk from 'chalk';

/**
 * Имитирует эффект набора текста в консоли с возможностью пропуска.
 * @param {string} text - Текст для вывода.
 * @param {number} [speed=25] - Скорость печати в миллисекундах.
 */
async function typeWriter(text, speed = 25) {
  return new Promise(resolve => {
    let i = 0;
    let timeoutId;
    let skipped = false;

    const skip = () => {
      if (skipped) return;
      skipped = true;
      clearTimeout(timeoutId);
      process.stdout.write(text.substring(i) + '\n');
      // Cleanup
      if (process.stdin.isTTY) {
        process.stdin.removeListener('data', skip);
        try {
          process.stdin.setRawMode(false);
        } catch (e) {
          // Ignore errors if stdin is already not in raw mode
        }
        process.stdin.pause();
      }
      resolve();
    };

    const type = () => {
      if (i < text.length && !skipped) {
        process.stdout.write(text.charAt(i));
        i++;
        timeoutId = setTimeout(type, speed);
      } else if (!skipped) {
        process.stdout.write('\n');
        // Cleanup
        if (process.stdin.isTTY) {
            process.stdin.removeListener('data', skip);
            try {
                process.stdin.setRawMode(false);
            } catch (e) {
                // Ignore
            }
            process.stdin.pause();
        }
        resolve();
      }
    };

    if (process.stdin.isTTY) {
        try {
            process.stdin.setRawMode(true);
        } catch (e) {
            // Fails in non-interactive environments
        }
        process.stdin.resume();
        process.stdin.on('data', skip);
    }

    type();
  });
}

export { typeWriter };
