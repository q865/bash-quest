import chalk from 'chalk';

/**
 * Имитирует эффект набора текста в консоли.
 * @param {string} text - Текст для вывода.
 * @param {number} [speed=50] - Скорость печати в миллисекундах.
 */
async function typeWriter(text, speed = 25) {
  return new Promise(resolve => {
    let i = 0;
    function type() {
      if (i < text.length) {
        process.stdout.write(text.charAt(i));
        i++;
        setTimeout(type, speed);
      } else {
        process.stdout.write('\n');
        resolve();
      }
    }
    type();
  });
}

export { typeWriter };
