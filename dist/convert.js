import { mdToPdf } from 'md-to-pdf';
import { remark } from 'remark';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { addToc } from './addToc.js';
import fs from 'fs';
/**
 * CSS for the markdown
 */
const basicCss = `
  .page-break { page-break-after: always; }
  .markdown-body { font-size: 14px; }
  .markdown-body pre > code { white-space: pre-wrap; }
`;
/**
 * Resolve our github markdown css file
 */
const fileDir = dirname(fileURLToPath(import.meta.url));
const relativeCssPath = "../static/github-markdown.min.css";
const styleSheetLocation = `${fileDir}/${relativeCssPath}`;
/**
 * Configs for md-to-pdf
 */
const configMdToPdf = {
    stylesheet: [styleSheetLocation],
    css: basicCss,
    body_class: ["markdown-body"],
    pdf_options: {
        format: "a4",
        margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" }
    }
};
/**
 * Generate PDF file from given filePath
 * @param {string} filePath input file path
 * @param {string} outFilePath output file path, default to changing input file
 * name to use .pdf extension
 */
export async function generatePdf(filePath, outFilePath) {
    let fileContent = "";
    const basedir = dirname(filePath);
    try {
        fileContent = fs.readFileSync(filePath, 'utf8');
    }
    catch (error) {
        throw error;
    }
    const withToc = await remark()
        .use(addToc)
        .process(fileContent)
        .then(f => String(f));
    const pdf = await mdToPdf({ content: withToc }, { basedir, ...configMdToPdf })
        .catch((e) => {
        console.log(e);
        console.log(`file path provided: ${filePath}`);
    });
    if (pdf) {
        fs.writeFileSync(outFilePath, pdf.content);
    }
}
