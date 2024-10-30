let canvasHistory = [];
let historyStep = -1;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function saveCanvasState() {
    if (historyStep < canvasHistory.length - 1) {
        canvasHistory = canvasHistory.slice(0, historyStep + 1);
    }
    canvasHistory.push(canvas.toDataURL());
    historyStep++;
}

canvas.addEventListener('mouseup', saveCanvasState);

function undo() {
    if (historyStep > 0) {
        historyStep--;
        restoreCanvasState(canvasHistory[historyStep]);
    }
}

function redo() {
    if (historyStep < canvasHistory.length - 1) {
        historyStep++;
        restoreCanvasState(canvasHistory[historyStep]);
    }
}

function restoreCanvasState(state) {
    const img = new Image();
    img.src = state;
    img.onload = () => context.drawImage(img, 0, 0);
}

function downloadCanvas() {
    const link = document.createElement('a');
    link.download = 'canvas-image.png';
    link.href = canvas.toDataURL();
    link.click();
}

function setColor(color) {
    context.strokeStyle = color;
    context.fillStyle = color;
}

function setBrushSize(size) {
    context.lineWidth = size;
}

// New features start here

// Text Tool
let isTextMode = false; // Track if text mode is active
let textInput = ""; // Store text input
let textX = 0; // X position for text
let textY = 0; // Y position for text

function enableTextMode() {
    isTextMode = true;
    canvas.addEventListener('click', setTextPosition);
}

function setTextPosition(event) {
    const rect = canvas.getBoundingClientRect();
    textX = event.clientX - rect.left;
    textY = event.clientY - rect.top;
    canvas.removeEventListener('click', setTextPosition); // Remove event listener after setting position
    isTextMode = false; // Disable text mode after setting position
    addText(); // Prompt for text input
}

function addText() {
    const text = prompt("Enter text:");
    if (text) {
        context.fillText(text, textX, textY);
        saveCanvasState(); // Save canvas state after adding text
    }
}

// Shape Drawing Tools
let shapeType = ''; // Variable to track the current shape type

function setShape(type) {
    shapeType = type;
}

function drawShape(event) {
    const rect = canvas.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;

    if (shapeType === 'rectangle') {
        context.strokeRect(startX, startY, 100, 50); // Example dimensions
    } else if (shapeType === 'circle') {
        context.beginPath();
        context.arc(startX, startY, 25, 0, Math.PI * 2); // Example radius
        context.stroke();
    }
    saveCanvasState(); // Save canvas state after drawing a shape
}

// Eraser Tool
let isEraserMode = false; // Track if eraser mode is active

function enableEraserMode() {
    isEraserMode = true;
    context.globalCompositeOperation = 'destination-out'; // Set the context to erase
}

function disableEraserMode() {
    isEraserMode = false;
    context.globalCompositeOperation = 'source-over'; // Reset to normal drawing
}

canvas.addEventListener('mousemove', (event) => {
    if (isEraserMode) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        context.clearRect(x - 10, y - 10, 20, 20); // Erase area around the cursor
    }
});

// Add event listeners for the new tools (buttons need to be defined in HTML)
document.getElementById('textToolButton').addEventListener('click', enableTextMode);
document.getElementById('rectangleButton').addEventListener('click', () => setShape('rectangle'));
document.getElementById('circleButton').addEventListener('click', () => setShape('circle'));
document.getElementById('eraserButton').addEventListener('click', () => {
    enableEraserMode();
    canvas.addEventListener('mouseleave', disableEraserMode); // Disable eraser when mouse leaves
});
