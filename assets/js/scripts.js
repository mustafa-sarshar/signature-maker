"use strict";

let paint = false;
let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();
let lstStrokeStyle = new Array();
let lstLineWidth = new Array();
let lstLineJoin = new Array();

let curStrokeStyle = "red";
let curLineJoin = "round";
let curLineWidth = 20;

let mouseXOld = 0;
let mouseYOld = 0;

const bodyRect = document.body.getBoundingClientRect();

const canvasDivEl = document.querySelector(".draw-wrapper");
const canvasEl = document.createElement("canvas");
canvasEl.setAttribute("width", "300");
canvasEl.setAttribute("height", "400");
canvasEl.setAttribute("id", "canvas");
canvasEl.classList.add("draw__canvas");
canvasDivEl.appendChild(canvasEl);
if (typeof G_vmlCanvasManager != "undefined") {
    canvasEl = G_vmlCanvasManager.initElement(canvasEl);
}
const context = canvasEl.getContext("2d");

canvasEl.addEventListener("mousedown", (evt) => {
    if (evt.target === canvasEl) {      
        const mouseX = getMousePositions(evt)["mouseX"];
        const mouseY = getMousePositions(evt)["mouseY"];
        
        mouseXOld = mouseX;
        mouseYOld = mouseY;

        paint = true;
        addClick(mouseX, mouseY);
        redraw();
    }
})

canvasEl.addEventListener("mousemove", (evt) => {
    if (evt.target === canvasEl) {
        if (paint) {
            const mouseX = getMousePositions(evt)["mouseX"];
            const mouseY = getMousePositions(evt)["mouseY"];

            if (mouseX !== mouseXOld && mouseY !== mouseYOld) {
                addClick(mouseX, mouseY, true);
                redraw();
            }
        }
    }
})

canvasEl.addEventListener("mouseup", (evt) => {
    if (evt.target === canvasEl)
        paint = false;
})

canvasEl.addEventListener("mouseleave", (evt) => {
    if (evt.target === canvasEl)
        paint = false;
})

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    lstStrokeStyle.push(curStrokeStyle);
    lstLineJoin.push(curLineJoin);
    lstLineWidth.push(curLineWidth);
}

function getMousePositions(event) {
    const rect = event.target.getBoundingClientRect();    // console.log(rect.top, rect.right, rect.bottom, rect.left);
    const mouseX = event.pageX - rect.left;
    const mouseY = event.pageY - rect.top;

    return {
        mouseX: mouseX,
        mouseY: mouseY
    }
}

function clearCanvas() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
}

function redraw(){
    clearCanvas();    

    for (let i=0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i-1], clickY[i-1]);
        } else {
            context.moveTo(clickX[i]-1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.strokeStyle = lstStrokeStyle[i];
        context.lineWidth = lstLineWidth[i];
        context.lineJoin = lstLineJoin[i];
        context.stroke();
    }
}

function inactiveAll(elements) {
    elements.forEach((el) => {
        el.classList.remove("active");
    })
}

const colorsEl = document.querySelectorAll(".tools__color-box");
colorsEl.forEach((item) => {
    item.addEventListener("click", (evt) => {
        if (item.classList.contains("black"))
            curStrokeStyle = "black";
        else if (item.classList.contains("white"))
            curStrokeStyle = "white";
        else if (item.classList.contains("red"))
            curStrokeStyle = "red";
        else if (item.classList.contains("green"))
            curStrokeStyle = "green";
        else if (item.classList.contains("blue"))
            curStrokeStyle = "blue";
        inactiveAll(colorsEl);
        item.classList.toggle("active");
    })
})

const lineWidthSliderEl = document.querySelector("#line-width__slider");
const curLineWidthEl = document.querySelector("#current-line-width");
curLineWidthEl.innerText = curLineWidth;
lineWidthSliderEl.oninput = function () {
    curLineWidth = this.value;
    curLineWidthEl.innerText = this.value;
}

const lineJoinEl = document.querySelectorAll(".tools__line-join__options");
lineJoinEl.forEach((item) => {
    item.addEventListener("click", (evt) => {
        if (item.innerText === "ROUND")
            curLineJoin = "round";
        else if (item.innerText === "BEVEL")
            curLineJoin = "bevel";
        else if (item.innerText === "MITER")
            curLineJoin = "miter";
        inactiveAll(lineJoinEl);
        item.classList.toggle("active");
    })
})

const resetBtnEl = document.querySelector(".draw__btn-reset");
resetBtnEl.addEventListener("click", (evt) => {
    clearCanvas();
    clickX = [];
    clickY = [];
    clickDrag = [];
    lstStrokeStyle = [];
    lstLineWidth = [];
    lstLineJoin = [];
})

const saveBtnEl = document.querySelector(".draw__btn-save");
saveBtnEl.addEventListener("click", (evt) => {
    const linkEl = document.createElement("a");
    linkEl.download = "my_signature.png";
    linkEl.href = canvasEl.toDataURL();
    linkEl.click();
    linkEl.delete;
})