#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generatePdf } from './convert.js';
import path from 'path';
import fs from 'fs';
import Listr from 'listr';
const parentMsg = 'no error if existing, make parent directories as neededs';
const args = yargs(hideBin(process.argv)).options({
    'outdir': { type: 'string', demandOption: false },
    'parent': { type: 'boolean', demandOption: false, alias: 'p', describe: parentMsg }
}).parseSync();
const outdir = args.outdir || '';
if (args.outdir && args.parent) {
    !fs.existsSync(args.outdir) && fs.mkdirSync(args.outdir, { recursive: true });
}
const files = [...new Set(args._)].map(e => e.toString());
function convToPath(file) {
    // '/tmp/someFolder' + 'fileName'
    // './somefolder/anotherSubfolder' + 'filename'
    const baseFileName = `${path.basename(file).replace('.md', '')}.pdf`;
    return path.join(outdir, baseFileName);
}
async function main() {
    await new Listr(files.map((file) => {
        return ({
            title: `Converting ${file} to pdf`,
            task: async () => {
                if (args.outdir)
                    await generatePdf(file, convToPath(file));
                else
                    await generatePdf(file, `${file.replace('.md', '')}.pdf`);
            }
        });
    }), {
        concurrent: true,
        exitOnError: false
    })
        .run()
        .catch((error) => { throw error; });
}
main().catch(e => console.log(e));
