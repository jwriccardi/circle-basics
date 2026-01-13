const canvas = document.getElementById('cartesianPlane');
const ctx = canvas.getContext('2d');
const uiAngleDeg = document.getElementById('angle-deg');
const uiAngleRad = document.getElementById('angle-rad');
const uiCoords = document.getElementById('coords');
const uiSin = document.getElementById('val-sin');
const uiCos = document.getElementById('val-cos');
const uiTan = document.getElementById('val-tan');

const WIDTH = 600;
const HEIGHT = 600;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const UNIT_SCALE = 200; // 200px = 1 unit

const SIN_COLOR = '#dc3545';
const COS_COLOR = '#0d6efd';
const TAN_COLOR = '#198754';

canvas.width = WIDTH;
canvas.height = HEIGHT;

// State
let currentAngle = 0; // radians
let isDragging = false;

function toScreenX(modelX) {
    return CENTER_X + modelX * UNIT_SCALE;
}

function toScreenY(modelY) {
    return CENTER_Y - modelY * UNIT_SCALE; // Flip Y for canvas
}

function updateUI() {
    let deg = (currentAngle * 180 / Math.PI) % 360;
    if (deg < 0) deg += 360;
    
    const x = Math.cos(currentAngle);
    const y = Math.sin(currentAngle);
    const tanVal = Math.tan(currentAngle);

    uiAngleDeg.textContent = `${deg.toFixed(1)}°`;
    uiAngleRad.textContent = `(${(currentAngle / Math.PI).toFixed(2)}π)`;
    uiCoords.textContent = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
    
    uiSin.textContent = y.toFixed(3);
    uiCos.textContent = x.toFixed(3);
    
    // Check for large values indicating asymptote
    if (Math.abs(tanVal) > 100) {
        uiTan.textContent = tanVal > 0 ? "+∞" : "-∞";
    } else {
        uiTan.textContent = tanVal.toFixed(3);
    }
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
    ctx.lineTo(screenX, originY); // Along X-axis
    ctx.stroke();

    // Sine (Vertical)
    ctx.strokeStyle = SIN_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(screenX, originY); // From X-axis
    ctx.lineTo(screenX, screenY); // To Point
    ctx.stroke();
}

function drawTangent() {
    const x = Math.cos(currentAngle);
    
    // Avoid drawing when angle is effectively vertical (tan undefined)
    if (Math.abs(x) < 0.01) return;

    const tanVal = Math.tan(currentAngle);
    
    // We visualize tangent on the line x = 1 (right side)
    // or x = -1 (left side) depending on which side the angle is facing
    // Standard definition uses x=1 axis.
    
    const targetX = x >= 0 ? 1 : -1;
    const targetY = tanVal * targetX; // y = tan(theta) * x direction
    
    const screenX1 = toScreenX(targetX);
    const screenY1 = toScreenY(0);
    const screenX2 = toScreenX(targetX);
    const screenY2 = toScreenY(targetY);
    
    // Draw the Tangent Line Segment
    ctx.strokeStyle = TAN_COLOR;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(screenX1, screenY1);
    ctx.lineTo(screenX2, screenY2);
    ctx.stroke();
    
    // Draw extension dotted line from center to tangent point
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(screenX2, screenY2);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawRadiusVector() {
    const x = Math.cos(currentAngle);
    const y = Math.sin(currentAngle);
    
    const screenX = toScreenX(x);
    const screenY = toScreenY(y);

    // Line from center
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
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
    drawTangent(); // Draw behind triangle
    drawTriangle();
    drawRadiusVector();
    updateUI();
}

// Interaction
function handleInput(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - CENTER_X;
    const y = CENTER_Y - (clientY - rect.top); // Invert Y
    
    currentAngle = Math.atan2(y, x);
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

// Touch support
canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault(); // Prevent scrolling
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

// Initial draw
draw();