import {createApp} from '../vue.v3.browser.js';

const gridWidth = 25;
const gridHeight = 10;
let positions = [];

for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
        positions.push({x, y});
    }
}
               
createApp({
    data() {
        return {
            scale: 22,
            positions: positions,
        };
    },
}).mount("#diagram");

