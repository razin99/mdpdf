#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import { generatePdf } from './convert.js';
import ora from 'ora';
import { ENOENT } from 'constants';
import { exit } from 'process';
const inMsg = "Path to input file";
const outMsg = "Output file path";
const args = yargs(hideBin(process.argv)).options({
    'in': { type: 'string', demandOption: true, alias: 'i', describe: inMsg },
    'out': { type: 'string', demandOption: false, alias: 'o', describe: outMsg },
}).parseSync();
const fileOut = args['out'] || args['in'].replace('.md', '') + '.pdf';
if (!fs.existsSync(args['in'])) {
    console.log("Unable to open file: " + args['in']);
    exit(ENOENT);
}
const spinnerMsg = `Converting ${args['in']} to pdf`;
const spinner = ora({
    text: spinnerMsg,
    spinner: "dots3",
    indent: 4,
}).start();
generatePdf(args['in'], fileOut)
    .then(() => { process.exitCode = 0; })
    .catch((err) => {
    console.log("Exiting due to: ");
    console.log(err);
    process.exitCode = err.code;
})
    .finally(() => {
    spinner.stop();
    process.exit();
});
