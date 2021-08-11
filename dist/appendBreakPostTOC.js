import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { html } from 'mdast-builder';
import find from 'unist-util-find';
export function appendBreakPostTOC(mdWithToc) {
    const search = {
        type: 'heading',
        children: [{ type: 'text', value: 'Table of Contents' }]
    };
    const tree = fromMarkdown(mdWithToc);
    const toc = find(tree, search);
    const tocIdx = tree.children.indexOf(toc);
    const pgBreak = html('<div class="page-break"></div>');
    tree.children = [
        ...tree.children.splice(0, tocIdx + 2),
        pgBreak,
        ...tree.children,
    ];
    return toMarkdown(tree);
}
