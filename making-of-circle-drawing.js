/*
 * From https://www.redblobgames.com/making-of/circle-drawing/
 * Copyright 2022 Red Blob Games <redblobgames@gmail.com>
 * @license Apache-2.0 <https://www.apache.org/licenses/LICENSE-2.0.html>
 */

console.info("I'm happy to answer questions about the code; email me at redblobgames@gmail.com");

import Vue from './vue.v2.esm.browser.js';

Vue.component('a-step', {
    props: ['src'],
    data() { return {html: "", js: ""}; },
    template: `<iframe :src="src"/>`,
    async mounted() {
        let loadHtml = fetch(this.src + "index.html");
        let loadJs = fetch(this.src + "circle-drawing.js");
        let html = await (await loadHtml).text();
        let js = await (await loadJs).text();
    },
});


for (let figure of document.querySelectorAll("figure")) {
    new Vue({
        el: figure,
    });
}
