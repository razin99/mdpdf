import { Root } from 'mdast';
import { zone, Node } from 'mdast-zone';
import { list } from 'mdast-builder';
import { toc, Result } from 'mdast-util-toc';
import { VFile } from 'vfile';

interface Options {
  /**
   * What zone symbol to search for, defaults to:
   * ```html
   * <!--toc start-->
   * <!--toc end-->
   * ```
   */
  zoneSymbol?: string

  /**
   * Heading to search for, case insensitive. Defaults to:
   * `'toc|table[ -]of[ -]contents?'`
   */
  heading?: string
}

/**
 * Add table of contents
 * Returns a transformer remark function
 */
export function addToc(options: Options = {}) {
  const lookup: string = options.zoneSymbol || 'toc';

  let table: Result;
  function transformer(tree: Root, _: VFile) {
    table = toc(tree, { heading: options.heading || 'toc|table[ -]of[ -]contents?'});
    zone(tree, lookup, mutate);
  }

  function mutate(start: Node, _: Array<Node>, end: Node): Array<Node> {
    if (table.map) {
      const ordering = table.map.ordered
        ? "ordered"
        : "unordered";
      return [start, <Node>list(ordering, table.map.children), end]
    } else {
      return [start, end];
    }
  }

  return transformer;

}

