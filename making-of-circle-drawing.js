/*
 * From https://www.redblobgames.com/making-of/circle-drawing/
 * Copyright 2022 Red Blob Games <redblobgames@gmail.com>
 * @license Apache-2.0 <https://www.apache.org/licenses/LICENSE-2.0.html>
 */

console.info("I'm happy to answer questions about the code; email me at redblobgames@gmail.com");

import Vue from './vue.v2.esm.browser.js';
import {Prism, Diff} from './_build/lib.js';


/** count how many spaces are at the beginning of a line */
function measureIndentation(line) {
    return line.length - line.trimStart().length;
}


/** extract some indented text starting with regexp 'begin', and
    including with if a closing line matches regexp 'end', and
    de-indent those lines */
function extractSection(input, begin, end=/[/}]/) {
    let lines = input.split('\n');
    let output = [];
    let matchIndentation = null;
    for (let line of lines) {
        // State machine: either we're inside or outside the matched region

        let beginMatch = line.match(begin);
        let endMatch = line.match(end);
        let indentation = measureIndentation(line);
        
        if (matchIndentation === null && beginMatch) { // outside
            matchIndentation = indentation;
        }

        if (matchIndentation !== null) { // inside
            output.push(line.slice(matchIndentation));
            if (endMatch && !beginMatch && indentation === matchIndentation) {
                matchIndentation = null;
            }
        }
    }

    return output.join('\n');
}


/** output diff lines with '+' or '-' or ' ' at the beginning */
function calculateDiffs(oldText, newText) {
    let oldLines = oldText.split('\n');
    let newLines = newText.split('\n');
    const isCommon = (aIndex, bIndex) => oldLines[aIndex] === newLines[bIndex];
    let outputLines = [];
    
    let ai = 0, bi = 0
    function record(type, lines) {
        for (let line of lines) outputLines.push(`${type}${line}`);
    }

    function foundSubsequence(nCommon, aCommon, bCommon) {
        // ai to aCommon are "deleted"
        // bi to bCommon are "inserted"
        // aCommon to aCommon+nCommon are "same"
        // bCommon to bCommon+nCommon are "same"
        record('-', oldLines.slice(ai, aCommon));
        record('+', newLines.slice(bi, bCommon));
        record(' ', oldLines.slice(aCommon, aCommon+nCommon));
        ai = aCommon + nCommon;
        bi = bCommon + nCommon;
    }
    
    Diff(oldLines.length, newLines.length, isCommon, foundSubsequence);
    record('-', oldLines.slice(ai));
    record('+', newLines.slice(bi));

    return outputLines.join('\n');
}

/* Highlight Vue v-bind and v-on */
Prism.languages.markup.tag.addAttribute(
    /(?:v-|:|@)[-a-zA-Z]+/.source,
    'javascript'
);

Vue.component('a-output', {
    props: ['step'],
    template: `<iframe ref="iframe" :src="step+'/'" scrolling="no" @load="resizeIFrame" />`,
    methods: {
        resizeIFrame() {
            let {iframe} = this.$refs;
            iframe.style.height = iframe.contentDocument.body.clientHeight + "px";
        },
    },
});

Vue.component('a-step', {
    props: ['step', 'show', 'restrict'],
    data() {
        return {
            tab: this.show ?? 'html', /* html, js */
            showDiff: false,
            prevHtml: "",
            prevJs: "",
            currHtml: "",
            currJs: "",
        };
    },
    template: `
    <pre v-else><code :class="languageClass" v-html="syntaxHighlightedText"/></pre>
    `,
    computed: {
        curr() { return this.step + "/"; },
        prev() { return (parseFloat(this.step)-1) + "/"; },
        lang() {
            return {html: "html", js: "javascript"}[this.tab];
        },
        languageClass() {
            let diff = this.showDiff? "diff-" : "";
            return `language-${diff}${this.lang}`;
        },
        syntaxHighlightedText() {
            let [prev, curr] =
                this.tab === 'html'? [this.prevHtml, this.currHtml]
                : this.tab === 'js'? [this.prevJs, this.currJs]
                : ["??", "??"];
            if (this.restrict) {
                prev = extractSection(prev, new RegExp(this.restrict));
                curr = extractSection(curr, new RegExp(this.restrict));
            }
            if (this.showDiff) {
                return Prism.highlight(calculateDiffs(prev, curr),
                                       Prism.languages.diff,
                                       "diff-" + this.lang);
            } else {
                return Prism.highlight(curr,
                                       Prism.languages[this.lang],
                                       this.lang);
            }
        },
    },
    async mounted() {
        if (this.prev) {
            let loadPrevHtml = fetch(this.prev + "index.html");
            let loadPrevJs = fetch(this.prev + "circle-drawing.js");
            this.prevHtml = await (await loadPrevHtml).text();
            this.prevJs = await (await loadPrevJs).text();
        }
        if (this.curr) {
            let loadCurrHtml = fetch(this.curr + "index.html");
            let loadCurrJs = fetch(this.curr + "circle-drawing.js");
            this.currHtml = await (await loadCurrHtml).text();
            this.currJs = await (await loadCurrJs).text();
        }
    },
});


for (let figure of document.querySelectorAll("figure")) {
    new Vue({
        el: figure,
    });
}
