import Vue from '../vue.v2.esm.browser.js';

const gridWidth = 25;
const gridHeight = 10;
let positions = [];

for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
        positions.push({x, y});
    }
}

function clamp(value, lo, hi) {
    return value < lo ? lo : value > hi ? hi : value;
}

function insideCircle(center, tile, radius) {
    let dx = center.x - tile.x,
        dy = center.y - tile.y;
    let distance = Math.sqrt(dx*dx + dy*dy);
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
                 @pointermove="pointerMove"/>`,
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
    computed: {
        centerPosition: {
            get() {
                return {
                    x: this.scale * (this.center.x + 1/2),
                    y: this.scale * (this.center.y + 1/2),
                };
            },
            set({x, y}) {
                x = Math.round(x / this.scale - 1/2);
                y = Math.round(y / this.scale - 1/2);
                this.center.x = clamp(x, 0, this.gridWidth-1);
                this.center.y = clamp(y, 0, this.gridHeight-1);
            },
        },
        radiusPosition: {
            get() {
                return {
                    x: this.centerPosition.x + this.scale * this.radius,
                    y: this.centerPosition.y,
                };
            },
            set({x, y}) {
                let distance = Math.hypot(x - this.centerPosition.x,
                                          y - this.centerPosition.y);
                let radius = Math.round(distance / this.scale);
                this.radius = clamp(radius, 1, 8);
            },
        },
    },
    methods: {
        // export these for use from the html template
        insideCircle,
    },
});
