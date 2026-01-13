const canvas = document.getElementById('cartesianPlane');
const ctx = canvas.getContext('2d');

const WIDTH = 600;
const HEIGHT = 600;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const UNIT_SCALE = 200; // 200px = 1 unit

canvas.width = WIDTH;
canvas.height = HEIGHT;

function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Grid lines
    for (let x = 0; x <= WIDTH; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y <= HEIGHT; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }
}

function drawAxes() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(WIDTH, CENTER_Y);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, HEIGHT);
    ctx.stroke();

    // Arrows
    ctx.fillStyle = '#333';
    // X arrow
    ctx.beginPath();
    ctx.moveTo(WIDTH, CENTER_Y);
    ctx.lineTo(WIDTH - 10, CENTER_Y - 5);
    ctx.lineTo(WIDTH - 10, CENTER_Y + 5);
    ctx.fill();
    // Y arrow
    ctx.beginPath();
    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X - 5, 10);
    ctx.lineTo(CENTER_X + 5, 10);
    ctx.fill();
}

function drawUnitCircle() {
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, UNIT_SCALE, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawLabels() {
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Origin
    ctx.fillText('(0,0)', CENTER_X - 20, CENTER_Y + 20);

    // Points on the circle
    ctx.fillStyle = '#d63384';
    
    // (1, 0)
    ctx.beginPath();
    ctx.arc(CENTER_X + UNIT_SCALE, CENTER_Y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText('(1, 0)', CENTER_X + UNIT_SCALE + 30, CENTER_Y);

    // (-1, 0)
    ctx.beginPath();
    ctx.arc(CENTER_X - UNIT_SCALE, CENTER_Y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText('(-1, 0)', CENTER_X - UNIT_SCALE - 30, CENTER_Y);

    // (0, 1) - Note: Canvas Y is inverted relative to Cartesian
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y - UNIT_SCALE, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText('(0, 1)', CENTER_X, CENTER_Y - UNIT_SCALE - 20);

    // (0, -1)
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y + UNIT_SCALE, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText('(0, -1)', CENTER_X, CENTER_Y + UNIT_SCALE + 20);
}

function init() {
    drawGrid();
    drawAxes();
    drawUnitCircle();
    drawLabels();
}

init();
