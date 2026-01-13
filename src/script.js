const canvas = document.getElementById('cartesianPlane');
const ctx = canvas.getContext('2d');

// UI Elements
const uiAngleDeg = document.getElementById('angle-deg');
const uiAngleRad = document.getElementById('angle-rad');
const uiCoords = document.getElementById('coords');
const uiSin = document.getElementById('val-sin');
const uiCos = document.getElementById('val-cos');
const uiTan = document.getElementById('val-tan');
const uiCot = document.getElementById('val-cot');
const uiSec = document.getElementById('val-sec');
const uiCsc = document.getElementById('val-csc');
const uiToggle = document.getElementById('unit-toggle');
const uiModeText = document.getElementById('mode-text');

const WIDTH = 600;
const HEIGHT = 600;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const UNIT_SCALE = 200; // 200px = 1 unit

// Colors
const SIN_COLOR = '#dc3545';
const COS_COLOR = '#0d6efd';
const TAN_COLOR = '#198754';
const COT_COLOR = '#0dcaf0';
const SEC_COLOR = '#fd7e14';
const CSC_COLOR = '#6f42c1';

canvas.width = WIDTH;
canvas.height = HEIGHT;

// State
let currentAngle = 0; // radians
let isDragging = false;
let mode = 'DEG'; // 'DEG' or 'RAD'

function toScreenX(modelX) {
    return CENTER_X + modelX * UNIT_SCALE;
}

function toScreenY(modelY) {
    return CENTER_Y - modelY * UNIT_SCALE; // Flip Y for canvas
}

function formatValue(val) {
    if (Math.abs(val) > 100) return (val > 0 ? "+∞" : "-∞");
    return val.toFixed(3);
}

function updateUI() {
    let deg = (currentAngle * 180 / Math.PI) % 360;
    if (deg < 0) deg += 360;
    
    // Highlight the active unit
    if (mode === 'DEG') {
        uiAngleDeg.style.fontWeight = 'bold';
        uiAngleDeg.style.color = '#000';
        uiAngleRad.style.fontWeight = 'normal';
        uiAngleRad.style.color = '#adb5bd';
    } else {
        uiAngleDeg.style.fontWeight = 'normal';
        uiAngleDeg.style.color = '#adb5bd';
        uiAngleRad.style.fontWeight = 'bold';
        uiAngleRad.style.color = '#000';
    }

    const x = Math.cos(currentAngle);
    const y = Math.sin(currentAngle);
    const tanVal = Math.tan(currentAngle);
    const cotVal = 1 / tanVal;
    const secVal = 1 / x;
    const cscVal = 1 / y;

    uiAngleDeg.textContent = `${deg.toFixed(1)}°`;
    uiAngleRad.textContent = `(${(currentAngle / Math.PI).toFixed(2)}π)`;
    uiCoords.textContent = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
    
    uiSin.textContent = formatValue(y);
    uiCos.textContent = formatValue(x);
    uiTan.textContent = formatValue(tanVal);
    uiCot.textContent = formatValue(cotVal);
    uiSec.textContent = formatValue(secVal);
    uiCsc.textContent = formatValue(cscVal);
}

function drawGrid() {
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;

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
}

function drawUnitCircle() {
    ctx.strokeStyle = '#ced4da';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, UNIT_SCALE, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawTriangle() {
    const x = Math.cos(currentAngle);
    const y = Math.sin(currentAngle);
    
    const screenX = toScreenX(x);
    const screenY = toScreenY(y);
    const originX = toScreenX(0);
    const originY = toScreenY(0);

    // Cosine (Horizontal)
    ctx.strokeStyle = COS_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(screenX, originY);
    ctx.stroke();

    // Sine (Vertical)
    ctx.strokeStyle = SIN_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(screenX, originY);
    ctx.lineTo(screenX, screenY);
    ctx.stroke();
}

function drawTangentAndSecant() {
    const x = Math.cos(currentAngle);
    if (Math.abs(x) < 0.01) return; // Vertical asymptote

    const targetX = x >= 0 ? 1 : -1;
    const tanVal = Math.tan(currentAngle);
    const targetY = tanVal * targetX;
    
    const originX = toScreenX(0);
    const originY = toScreenY(0);
    const screenX_TanStart = toScreenX(targetX);
    const screenY_TanStart = toScreenY(0);
    const screenX_TanEnd = toScreenX(targetX);
    const screenY_TanEnd = toScreenY(targetY);
    
    // Tangent (Green) - Segment on x=1 or x=-1
    ctx.strokeStyle = TAN_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(screenX_TanStart, screenY_TanStart);
    ctx.lineTo(screenX_TanEnd, screenY_TanEnd);
    ctx.stroke();

    // Secant (Orange) - Hypotenuse from Origin to Tangent End
    ctx.strokeStyle = SEC_COLOR;
    ctx.lineWidth = 2;
    // We want the Secant to be distinct, maybe slightly offset or dashed? 
    // Usually it overlaps the radius, but it goes further if sec > 1.
    // Let's draw it solid but behind or on top. 
    // Since Radius is drawn last, let's draw Secant here.
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(screenX_TanEnd, screenY_TanEnd);
    ctx.stroke();
}

function drawCotangentAndCosecant() {
    const y = Math.sin(currentAngle);
    if (Math.abs(y) < 0.01) return; // Horizontal asymptote

    const targetY = y >= 0 ? 1 : -1;
    // cot = x/y. The line is y = 1. X coordinate is cot(theta) * targetY?
    // If targetY is 1, X = cot. Point is (cot, 1).
    // If targetY is -1, X = cot * -1? No.
    // Cotangent line is at y=1 or y=-1.
    // The point is intersection of radius extension with y=targetY.
    // X = cot(theta) * targetY.
    
    const cotVal = 1 / Math.tan(currentAngle);
    const targetX = cotVal * targetY;

    const originX = toScreenX(0);
    const originY = toScreenY(0);
    const screenX_CotStart = toScreenX(0);
    const screenY_CotStart = toScreenY(targetY);
    const screenX_CotEnd = toScreenX(targetX);
    const screenY_CotEnd = toScreenY(targetY);

    // Cotangent (Cyan) - Segment on y=1 or y=-1
    ctx.strokeStyle = COT_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(screenX_CotStart, screenY_CotStart);
    ctx.lineTo(screenX_CotEnd, screenY_CotEnd);
    ctx.stroke();

    // Cosecant (Purple) - Hypotenuse from Origin to Cotangent End
    ctx.strokeStyle = CSC_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(screenX_CotEnd, screenY_CotEnd);
    ctx.stroke();
}

function drawRadiusVector() {
    const x = Math.cos(currentAngle);
    const y = Math.sin(currentAngle);
    
    const screenX = toScreenX(x);
    const screenY = toScreenY(y);

    // Line from center
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(screenX, screenY);
    ctx.stroke();

    // Point
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawGrid();
    drawAxes();
    drawUnitCircle();
    
    // Draw secondary functions first so they are behind primary ones if they overlap
    drawCotangentAndCosecant();
    drawTangentAndSecant();
    
    drawTriangle();
    drawRadiusVector();
    updateUI();
}

// Interaction
function handleInput(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - CENTER_X;
    const y = CENTER_Y - (clientY - rect.top);
    
    let rawAngle = Math.atan2(y, x);
    if (rawAngle < 0) rawAngle += 2 * Math.PI;

    // Snapping Logic
    if (mode === 'DEG') {
        // Snap to nearest degree
        let deg = rawAngle * 180 / Math.PI;
        deg = Math.round(deg);
        currentAngle = deg * Math.PI / 180;
    } else {
        // Snap to nearest PI/24 (7.5 degrees) for cleaner radian fractions
        const step = Math.PI / 24;
        currentAngle = Math.round(rawAngle / step) * step;
    }

    draw();
}

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleInput(e.clientX, e.clientY);
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        handleInput(e.clientX, e.clientY);
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
    handleInput(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    if (isDragging) {
        e.preventDefault();
        handleInput(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

window.addEventListener('touchend', () => {
    isDragging = false;
});

// Toggle Logic
uiToggle.addEventListener('change', (e) => {
    mode = e.target.checked ? 'RAD' : 'DEG';
    uiModeText.textContent = mode;
    updateUI(); // Refresh UI emphasis
});

// Initial draw
draw();
