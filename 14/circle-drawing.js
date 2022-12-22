import Vue from '../vue.v2.esm.browser.js';

const gridCols = 25;
const gridRows = 10;
let positions = [];

for (let q = 0; q < gridCols; q++) {
    for (let r = 0; r < gridRows; r++) {
        positions.push({q, r});
    }
}

function clamp(value, lo, hi) {
    return value < lo ? lo : value > hi ? hi : value;
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

Vue.component('drag-handle', {
    props: ['value', 'color', 'size'],
    template: `<circle :fill="color" :r="size"
                 :cx="value.x" :cy="value.y"
                 @touchstart.prevent=""
                 @pointerdown="pointerDown"
                 @pointerup="pointerUp"
                 @pointercancel="pointerUp"
                 @pointermove="pointerMove" />`,
    data: () => ({dragging: false}),
    methods: {
        pointerDown(event) {
            this.dragging = true;
            event.target.setPointerCapture(event.pointerId);
            this.pointerMove(event);
        },
        pointerUp(event) {
            this.dragging = false;
        },
        pointerMove(event) {
            if (!this.dragging) return;
            let {x, y} = convertPixelToSvgCoord(event);
            this.$emit('input', {x, y});
        },
    },
});


for (let el of document.querySelectorAll("figure")) {
    new Vue({
        el: el,
        data: {
            scale: 22,
            gridCols,
            gridRows,
            positions,
            center: {q: 5, r: 4},
            radius: 4,
        },
        computed: {
            centerPosition: {
                get() {
                    return {
                        x: (this.center.q + 1/2) * this.scale,
                        y: (this.center.r + 1/2) * this.scale,
                    };
                },
                set({x, y}) {
                    let q = Math.round(x / this.scale - 1/2);
                    let r = Math.round(y / this.scale - 1/2);
                    this.center.q = clamp(q, 0, this.gridCols-1);
                    this.center.r = clamp(r, 0, this.gridRows-1);
                },
            },
            radiusPosition: {
                get() {
                    return {
                        x: this.centerPosition.x + this.radius * this.scale,
                        y: this.centerPosition.y,
                    };
                },
                set({x, y}) {
                    let distance = Math.hypot(x - this.centerPosition.x,
                                              y - this.centerPosition.y);
                    this.radius = clamp(distance / this.scale, 1, 8);
                },
            },
        },
        methods: {
            distanceLabel(q, r) {
                let distance = Math.hypot(q - this.center.q, r - this.center.r);
                return distance.toFixed(distance >= 10? 0 : 1);
            },
            // export these for use from the html template
            insideCircle,
        },
    });
}
