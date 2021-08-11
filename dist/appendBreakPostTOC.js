import { html } from 'mdast-builder';
import find from 'unist-util-find';
/**
 * Add page break after table of contents
 * Returns a transformer remark function
 */
export function addPageBreak(options = {}) {
    const pageBreak = options.breakSymbol || '<div class="page-break"></div>';
    function transformer(tree, _) {
        const search = {
            type: 'heading',
            children: [{ type: 'text', value: 'Table of Contents' }]
        };
        const toc = find(tree, search);
        if (!toc)
            return;
        const tocIdx = tree.children.indexOf(toc);
        const pgBreak = html(pageBreak);
        tree.children = [
            ...tree.children.splice(0, tocIdx + 2),
            pgBreak,
            ...tree.children,
        ];
    }
    return transformer;
}
