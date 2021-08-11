import { html } from 'mdast-builder';
import { Root, Content, HTML } from 'mdast';
import { VFile } from 'vfile';
import find from 'unist-util-find';

interface Options {
  /**
   * The break symbol to insert, defaults to:
   *    `<div class="page-break"></div>`
   * Can be specified to any other string.
   */
  breakSymbol?: string;
}

/**
 * Add page break after table of contents
 * Returns a transformer remark function
 */
export function addPageBreak(options: Options = {}) {
  const pageBreak = options.breakSymbol || '<div class="page-break"></div>'

  function transformer(tree: Root, _: VFile) {
    const search = {
      type: 'heading',
      children: [{ type: 'text', value: 'Table of Contents' }]
    }

    const toc: Content = <Content>find(tree, search);
    if (!toc) return;

    const tocIdx: number = tree.children.indexOf(toc);
    const pgBreak: HTML = <HTML>html(pageBreak);
    tree.children = [
      ...tree.children.splice(0, tocIdx + 2),
      pgBreak,
      ...tree.children,
    ]
  }
  return transformer;
}

