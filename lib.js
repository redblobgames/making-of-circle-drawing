/*
 * From https://www.redblobgames.com/making-of/circle-drawing/
 *
 * I'm bundling the libraries I use, without bundling the main page.
 * That way I don't need a build step for the main page.
 */

import diff from 'diff-sequences';
import prism from 'prismjs';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-handlebars.js';
import 'prismjs/components/prism-diff.js';
import 'prismjs/plugins/diff-highlight/prism-diff-highlight.js';

export {
    diff as Diff,
    prism as Prism,
}
