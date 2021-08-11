import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { html } from 'mdast-builder';
import { Root, Content, HTML } from 'mdast';
import find from 'unist-util-find';

export function appendBreakPostTOC(mdWithToc: string): string {
  const search = {
    type: 'heading',
    children: [{ type: 'text', value: 'Table of Contents' }]
  }
  const tree: Root = fromMarkdown(mdWithToc);
  const toc: Content = <Content>find(tree, search);
  const tocIdx: number = tree.children.indexOf(toc);
  const pgBreak: HTML = <HTML>html('<div class="page-break"></div>');
  tree.children = [
    ...tree.children.splice(0, tocIdx + 2),
    pgBreak,
    ...tree.children,
  ]
  return toMarkdown(tree);
}
