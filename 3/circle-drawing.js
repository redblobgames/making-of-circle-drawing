import Vue from '../vue.v2.esm.browser.js';

const gridCols = 25;
const gridRows = 10;
let positions = [];

for (let q = 0; q < gridCols; q++) {
    for (let r = 0; r < gridRows; r++) {
        positions.push({q, r});
    }
}
               
new Vue({
    el: "#diagram",
    data: {
        scale: 22,
        gridCols,
        gridRows,
        positions,
    },
});
