#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generatePdf } from './convert.js';
import path from 'path';
import fs from 'fs';
import Listr from 'listr';
import { exit } from 'process';
const parentMsg = 'Make directories if needed';
const outdirMsg = 'Output directory';
const yargsConf = yargs(hideBin(process.argv))
    .options({
    'outdir': { type: 'string', demandOption: false, describe: outdirMsg },
    'parent': { type: 'boolean', demandOption: false, alias: 'p', describe: parentMsg },
})
    .command('*', 'Markdown file(s) to convert');
const args = yargsConf.parseSync();
if (hideBin(process.argv).length === 0) {
    yargsConf.showHelp();
    exit(1);
}
const outdir = args.outdir || '';
if (args.outdir && args.parent) {
    // only create directories if parent flag is set
    !fs.existsSync(args.outdir) && fs.mkdirSync(args.outdir, { recursive: true });
}
const files = [...new Set(args._)].map(e => e.toString());
/**
 * Normalize file to include output directory.
 * Joins output directory with the basename of the file.
 * @param file  string containing the absolute path of file
 * @returns string of the new file path
 */
function convToPath(file) {
    const baseFileName = `${path.basename(file).replace('.md', '')}.pdf`;
    return path.join(outdir, baseFileName);
}
/**
 * Create a Listr task
 * @param file string to the file to convert to pdf
 * @return ListrTask object, generatePdf ran with async
 */
function makeListr(file) {
    const title = `Converting ${path.basename(file)} to pdf`;
    let task;
    if (args.outdir) {
        task = async () => generatePdf(file, convToPath(file));
    }
    else {
        task = async () => generatePdf(file, `${file.replace('.md', '')}.pdf`);
    }
    return { title, task };
}
async function main() {
    await new Listr(files.map(makeListr), {
        concurrent: true,
        exitOnError: false
    })
        .run()
        .catch((error) => { throw error; });
}
main()
    .catch(e => console.log(e))
    .finally(() => process.exit());
