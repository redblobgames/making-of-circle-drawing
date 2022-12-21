import Vue from '../vue.v2.esm.browser.js';

const gridCols = 25;
const gridRows = 10;
let positions = [];

for (let q = 0; q < gridCols; q++) {
    for (let r = 0; r < gridRows; r++) {
        positions.push({q, r});
    }
}

function insideCircle(center, tile, radius) {
    let dq = center.q - tile.q,
        dr = center.r - tile.r;
    let distance = Math.sqrt(dq*dq + dr*dr);
    return distance <= radius;
}

/** Convert from event coordinate space (on the page) to SVG coordinate
 * space (within the svg, honoring responsive resizing, width/height,
 * and viewBox */
function convertPixelToSvgCoord(event) {
    const svg = event.target.ownerSVGElement;
    let p = svg.createSVGPoint();
    p.x = event.clientX;
    p.y = event.clientY;
    p = p.matrixTransform(svg.getScreenCTM().inverse());
    return p;
}

new Vue({
    el: "#diagram",
    data: {
        scale: 22,
        gridCols,
        gridRows,
        positions,
        center: {q: 5, r: 4},
        radius: 4,
    },
    methods: {
        moveCenter(event) {
            let {x, y} = convertPixelToSvgCoord(event);
            this.center.x = x / this.scale - 1/2;
            this.center.y = y / this.scale - 1/2;
        },
        
        // export these for use from the html template
        insideCircle,
    },
});
