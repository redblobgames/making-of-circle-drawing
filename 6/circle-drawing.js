import Vue from '../vue.v2.esm.browser.js';

const gridWidth = 25;
const gridHeight = 10;
let positions = [];

for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
        positions.push({x, y});
    }
}

function insideCircle(center, tile, radius) {
    let dx = center.x - tile.x,
        dy = center.y - tile.y;
    let distance = Math.sqrt(dx*dx + dy*dy);
    return distance <= radius;
}

new Vue({
    el: "#diagram",
    data: {
        scale: 22,
        gridWidth,
        gridHeight,
        positions,
        center: {x: 5, y: 4},
        radius: 4,
    },
    methods: {
        // export these for use from the html template
        insideCircle,
    },
});
