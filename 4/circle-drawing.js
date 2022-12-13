import Vue from '../vue.v2.esm.browser.js';

const gridWidth = 25;
const gridHeight = 10;
let positions = [];

for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
        positions.push({x, y});
    }
}
               
new Vue({
    el: "#diagram",
    data: {
        scale: 22,
        gridWidth,
        gridHeight,
        positions,
    },
});
