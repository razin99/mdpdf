#!/usr/bin/env node

import yargs from 'yargs';
import { exit } from 'process';
import fs from 'fs';
import { hideBin } from 'yargs/helpers';
import { generatePdf } from './convert.js';
import ora from 'ora';
import { ENOENT } from 'constants';

const args = yargs(hideBin(process.argv)).options({
  'in': { type: 'string', demandOption: true, alias: 'i' },
  'out': { type: 'string', demandOption: false, alias: 'o' },
}).parseSync();

const fileOut = args.out ? args.out : args.in.replace('.md', '') + '.pdf';

if (!fs.existsSync(args['in'])) {
  const err = new Error("Unable to open file: " + args['in']);
  err.stack = null;
  err.code = 'ENOENT';
  err.errno = ENOENT;
  throw err;
}

const spinner = ora(`Converting ${args['in']} to pdf`).start();

generatePdf(args.in, fileOut)
  .then(() => { process.exitCode = 0; })
  .catch((err) => {
    console.log("Exiting due to: ");
    console.log(err);
    process.exitCode = err.code;
  })
  .finally(() => {
    spinner.stop();
    process.exit()
  })

