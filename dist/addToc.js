import { zone } from 'mdast-zone';
import { list } from 'mdast-builder';
import { toc } from 'mdast-util-toc';
/**
 * Add table of contents
 * Returns a transformer remark function
 */
export function addToc(options = {}) {
    const lookup = options.zoneSymbol || 'toc';
    let table;
    function transformer(tree, _) {
        table = toc(tree, { heading: options.heading || 'toc|table[ -]of[ -]contents?' });
        zone(tree, lookup, mutate);
    }
    function mutate(start, _, end) {
        if (table.map) {
            const ordering = table.map.ordered
                ? "ordered"
                : "unordered";
            return [start, list(ordering, table.map.children), end];
        }
        else {
            return [start, end];
        }
    }
    return transformer;
}
