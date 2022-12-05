/*
 * From https://www.redblobgames.com/making-of/circle-drawing/
 * Copyright 2022 Red Blob Games <redblobgames@gmail.com>
 * @license Apache-2.0 <https://www.apache.org/licenses/LICENSE-2.0.html>
 */

console.info("I'm happy to answer questions about the code; email me at redblobgames@gmail.com");

import Vue from './vue.v2.esm.browser.js';
/* global Prism */

/* Highlight Vue v-bind and v-on */
Prism.languages.markup.tag.addAttribute(
    /(?:v-|:|@)[-a-zA-Z]+/.source,
    'javascript'
);

Vue.component('a-step', {
    props: ['src', 'show-all'],
    data() {
        return {
            tab: 'html',
            html: "",
            js: "",
        };
    },
    template: `
    <div>
       <iframe v-if="tab === 'output'" :src="src"/>
       <pre v-if="tab === 'html'"><code class="language-diff-html" v-html="syntaxHighlightedHtml"/></pre>
    </div>
    `,
    computed: {
        syntaxHighlightedHtml() {
            let html = this.html;
            if (!this.showAll) {
                let i = this.html.indexOf("<figure"),
                    j = this.html.indexOf("</figure");
                let lines = this.html.slice(i, j).split('\n');
                lines = lines.map(line => line.replace(/^    /, ""));
                lines = lines.map(line => "+" + line); // HACK: for diff; need to actually implement diff
                html = lines.join('\n') + "</figure>";
            }
            return Prism.highlight(html, Prism.languages.diff, 'diff-html');
        },
    },
    async mounted() {
        let loadHtml = fetch(this.src + "index.html");
        let loadJs = fetch(this.src + "circle-drawing.js");
        this.html = await (await loadHtml).text();
        this.js = await (await loadJs).text();
    },
});


for (let figure of document.querySelectorAll("figure")) {
    new Vue({
        el: figure,
    });
}
