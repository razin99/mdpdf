import ora from 'ora';
import { exec } from 'child_process';

const spinnerMsg = "Compiling...";
const spinner = ora({
  text: spinnerMsg,
  spinner: "dots3",
})

/**
 * Made the spinner actually spin, thanks to this:
 * https://github.com/sindresorhus/ora/issues/86#issuecomment-471454758
 */

function compile() {
  return new Promise((resolve, reject) => {
    exec("tsc").on('close', code => {
      if (code === 0) resolve();
      else reject();
    })
  })
}

async function run() {
  spinner.start();
  await compile();
  spinner.stop();
}

run();

