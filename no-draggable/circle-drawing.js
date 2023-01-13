// From https://www.redblobgames.com/making-of/circle-drawing/
// License: CC0 https://creativecommons.org/publicdomain/zero/1.0/

import Vue from '../vue.v2.esm.browser.js';

const gridCols = 18;
const gridRows = 10;
let positions = [];

for (let q = 0; q < gridCols; q++) {
    for (let r = 0; r < gridRows; r++) {
        positions.push({q, r});
    }
}

for (let el of document.querySelectorAll("figure")) {
    new Vue({
        el: el,
        data: {
            gridCols,
            gridRows,
            positions,
            center: {q: 8, r: 5},
            radius: 3.5,
        },
        computed: {
            bbox() {
                return {
                    left:   Math.ceil(this.center.q - this.radius) - 0.5,
                    right:  Math.floor(this.center.q + this.radius) + 0.5,
                    top:    Math.ceil(this.center.r - this.radius) - 0.5,
                    bottom: Math.floor(this.center.r + this.radius) + 0.5,
                };
            },
        },
        methods: {
            distanceLabel(q, r) {
                let distance = Math.hypot(q - this.center.q, r - this.center.r);
                return distance.toFixed(distance >= 10? 0 : 1);
            },
            insideBounds(tile) {
                // Note that bbox values have +/- 0.5 for the visuals
                // but the tile values are integers so it should be ok
                // for this computation too
                return this.bbox.left <= tile.q && tile.q <= this.bbox.right
                    && this.bbox.top <= tile.r && tile.r <= this.bbox.bottom;
            },
            insideCircle(tile) {
                let dq = this.center.q - tile.q,
                    dr = this.center.r - tile.r;
                let distance = Math.sqrt(dq*dq + dr*dr);
                return distance <= this.radius;
            },
        },
    });
}
