#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import { generatePdf } from './convert.js';
import { ENOENT } from 'constants';
import { exit } from 'process';
import Listr from 'listr';
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
async function main() {
    await new Listr([
        {
            title: spinnerMsg,
            task: async () => generatePdf(args['in'], fileOut)
        }
    ]).run();
}
main().catch(e => console.log(e));
