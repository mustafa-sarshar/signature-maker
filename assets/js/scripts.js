"use strict";

let paint = false;
const objDraw = {
    clickX: [],
    clickY: [],
    clickDrag: [],
    lstStrokeStyle: [],
    lstLineJoin: [],
    lstLineWidth: [],
}

const objOptions = {
    curStrokeStyle: "red",
    curLineJoin: "round",
    curLineWidth: 20
}

let mouseXOld = 0;
let mouseYOld = 0;

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

canvasEl.addEventListener("pointerdown", (evt) => {
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

canvasEl.addEventListener("pointermove", (evt) => {
    if (evt.target === canvasEl) {
        if (paint) {
            const mouseX = getMousePositions(evt)["mouseX"];
            const mouseY = getMousePositions(evt)["mouseY"];
            if (mouseX !== mouseXOld && mouseY !== mouseYOld) {
                addClick(mouseX, mouseY, true);
                redraw();
            }
            mouseXOld = mouseX;
            mouseYOld = mouseY;
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
    objDraw["clickX"].push(x);
    objDraw["clickY"].push(y);
    objDraw["clickDrag"].push(dragging);
    objDraw["lstStrokeStyle"].push(objOptions["curStrokeStyle"]);
    objDraw["lstLineJoin"].push(objOptions["curLineJoin"]);
    objDraw["lstLineWidth"].push(objOptions["curLineWidth"]);
}

function getMousePositions(event) {
    const rect = event.target.getBoundingClientRect();
    // console.log(rect.top, rect.right, rect.bottom, rect.left);
    const mouseX = event.pageX - rect.left;
    const mouseY = event.pageY - rect.top;

    return {
        mouseX: mouseX,
        mouseY: mouseY
    }
}

function clearCanvas() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function redraw(){
    clearCanvas();
    for (let i=0; i < objDraw["clickX"].length; i++) {
        context.beginPath();
        if (objDraw["clickDrag"][i] && i) {
            context.moveTo(objDraw["clickX"][i - 1], objDraw["clickY"][i - 1]);
        } else {
            context.moveTo(objDraw["clickX"][i] - 1, objDraw["clickY"][i]);
        }
        context.lineTo(objDraw["clickX"][i], objDraw["clickY"][i]);
        context.closePath();
        context.strokeStyle = objDraw["lstStrokeStyle"][i];
        context.lineWidth = objDraw["lstLineWidth"][i];
        context.lineJoin = objDraw["lstLineJoin"][i];
        context.stroke();
    }
}

function inactiveAll(elements) {
    elements.forEach((el) => {
        el.classList.remove("active");
    })
}

// Stroke Style Event Listener *********
const colorsEl = document.querySelectorAll(".tools__color-box");
colorsEl.forEach((item) => {
    item.addEventListener("click", (evt) => {
        if (item.classList.contains("black"))
            objOptions["curStrokeStyle"] = "black";
        else if (item.classList.contains("white"))
            objOptions["curStrokeStyle"] = "white";
        else if (item.classList.contains("red"))
            objOptions["curStrokeStyle"] = "red";
        else if (item.classList.contains("green"))
            objOptions["curStrokeStyle"] = "green";
        else if (item.classList.contains("blue"))
            objOptions["curStrokeStyle"] = "blue";
        inactiveAll(colorsEl);
        item.classList.toggle("active");
    })
})

// Line Width Event Listener *****
const lineWidthSliderEl = document.querySelector("#line-width__slider");
const curLineWidthEl = document.querySelector("#current-line-width");
curLineWidthEl.innerText = objOptions["curLineWidth"];
lineWidthSliderEl.oninput = function () {
    objOptions["curLineWidth"] = this.value;
    curLineWidthEl.innerText = this.value;
}

// Line Join Button Event Listener *********
const lineJoinEl = document.querySelectorAll(".tools__line-join__options");
lineJoinEl.forEach((item) => {
    item.addEventListener("click", (evt) => {
        if (item.innerText === "ROUND")
            objOptions["curLineJoin"] = "round";
        else if (item.innerText === "BEVEL")
            objOptions["curLineJoin"] = "bevel";
        else if (item.innerText === "MITER")
            objOptions["curLineJoin"] = "miter";
        inactiveAll(lineJoinEl);
        item.classList.toggle("active");
    })
})

// Reset Button Event Listener *********
const resetBtnEl = document.querySelector(".draw__btn-reset");
resetBtnEl.addEventListener("click", (evt) => {
    clearCanvas();
    objDraw["clickX"] = [];
    objDraw["clickY"] = [];
    objDraw["clickDrag"] = [];
    objDraw["lstStrokeStyle"] = [];
    objDraw["lstLineJoin"] = [];
    objDraw["lstLineWidth"] = [];
})

// Save Button Event Listener *********
const saveBtnEl = document.querySelector(".draw__btn-save");
saveBtnEl.addEventListener("click", (evt) => {
    const linkEl = document.createElement("a");
    linkEl.download = "my_signature.png";
    linkEl.href = canvasEl.toDataURL();
    linkEl.click();
    linkEl.delete;
})