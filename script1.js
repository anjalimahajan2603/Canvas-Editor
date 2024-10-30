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
