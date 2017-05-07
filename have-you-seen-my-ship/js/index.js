'use strict';

// Threw this together really quickly. Could be made ~a zillion x
// more performant if we just drew each layer *once* to its own
// canvas (with a bit of overflow for wrapping) and animated those
// elements. I didn't do this because I'm lazy and bad.
// - rjs
var L = 600;
var NUM_LAYERS = 6;
var STAR_COLOR = [255, 255, 255];
var SPEED = 1 / 30;

var layerToNumStars = function layerToNumStars(layer) {
    return Math.pow(2, NUM_LAYERS - layer);
};
var layerToRadius = function layerToRadius(layer) {
    return (layer + 1) * 1.1;
};
var layerToSpeed = function layerToSpeed(layer) {
    return (layer + 1) * SPEED;
};

var drawShip = function drawShip(_) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#121212';
    ctx.beginPath();
    ctx.moveTo(L * 16 / 20, L / 2);
    ctx.lineTo(L * 6 / 20, L * 7 / 20);
    ctx.lineTo(L * 6 / 20, L * 13 / 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};

var drawStars = function drawStars(t, stars, layer) {
    var xOffset = t * layerToSpeed(layer);
    stars.forEach(function (_ref) {
        var r = _ref.r;
        var x = _ref.x;
        var y = _ref.y;

        x = L - ((x + xOffset) % (L + r * 2) - r);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * PI);
        ctx.fill();
    });
};

var _Math = Math;
var PI = _Math.PI;
var floor = _Math.floor;

var SPLIT_INDEX = floor(NUM_LAYERS / 2);
var container = document.querySelector('.container');
var social = document.querySelector('.social');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = canvas.height = L;
canvas.style.width = canvas.style.height = L / 2 + 'px';
ctx.fillStyle = 'rgb(' + STAR_COLOR + ')';
social.style.color = 'rgb(' + STAR_COLOR + ')';
social.style.borderColor = 'rgba(' + STAR_COLOR + ', 1)';

var layers = Array.from({ length: NUM_LAYERS }, function (_, layer) {
    return Array.from({ length: layerToNumStars(layer) }, function (_) {
        var r = layerToRadius(layer);
        var x = (L + 2 * r) * Math.random() - r;
        var y = (L + 2 * r) * Math.random() - r;
        return { r: r, x: x, y: y };
    });
});

function draw(t) {
    ctx.clearRect(0, 0, L, L);
    // Draw the back layers first.
    layers.slice(0, SPLIT_INDEX).forEach(drawStars.bind(null, t));
    // Block the stars with our "ship".
    drawShip();
    // Draw the front layers.
    layers.slice(SPLIT_INDEX).forEach(function (stars, layer) {
        drawStars(t, stars, layer + SPLIT_INDEX);
    });
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
container.insertBefore(canvas, social);