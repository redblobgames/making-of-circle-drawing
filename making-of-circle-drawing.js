/*
 * From https://www.redblobgames.com/making-of/circle-drawing/
 * Copyright 2022 Red Blob Games <redblobgames@gmail.com>
 * @license Apache-2.0 <https://www.apache.org/licenses/LICENSE-2.0.html>
 */

console.info("I'm happy to answer questions about the code; email me at redblobgames@gmail.com");

import Vue from './vue.v2.esm.browser.js';
import {Prism, Diff} from './_build/lib.js';


/** extract the <figure> section of the html, and de-indent */
function extractFigure(html) {
    let i = html.indexOf("<figure"),
        j = html.indexOf("</figure");
    let lines = html.slice(i, j).split('\n');
    lines = lines.map(line => line.replace(/^    /, ""));
    html = lines.join('\n') + "</figure>";
    return html;
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
    props: ['step', 'show', 'from'],
    data() {
        return {
            tab: this.show ?? 'figure', /* html, figure, js */
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
            return {html: "html", figure: "html", js: "javascript"}[this.tab];
        },
        languageClass() {
            let diff = this.showDiff? "diff-" : "";
            return `language-${diff}${this.lang}`;
        },
        prevFigure() { return extractFigure(this.prevHtml); },
        currFigure() { return extractFigure(this.currHtml); },
        syntaxHighlightedText() {
            let [prev, curr] =
                this.tab === 'html'? [this.prevHtml, this.currHtml]
                : this.tab === 'figure'? [this.prevFigure, this.currFigure]
                : this.tab === 'js'? [this.prevJs, this.currJs]
                : ["??", "??"];
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
