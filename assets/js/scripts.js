"use strict";

let paint = false;
const objDraw = {
    clickX: [],
    clickY: [],
    clickDrag: [],
    lstStrokeStyle: [],
    lstLineJoin: [],
    lstLineWidth: []
}

const objOptions = {
    curStrokeStyle: "red",
    curLineJoin: "round",
    curLineWidth: 15
}

let mouseXOld = 0;
let mouseYOld = 0;

let objDrawSize = {
    width: "300",
    height: "300"
}

const canvasDivEl = document.querySelector(".draw-wrapper");
const canvasEl = document.createElement("canvas");
canvasEl.setAttribute("width", objDrawSize["width"]);
canvasEl.setAttribute("height", objDrawSize["height"]);
canvasEl.setAttribute("id", "canvas");
canvasEl.classList.add("draw__canvas");
canvasDivEl.appendChild(canvasEl);
if (typeof G_vmlCanvasManager != "undefined") {
    canvasEl = G_vmlCanvasManager.initElement(canvasEl);
}
const context = canvasEl.getContext("2d");

canvasEl.addEventListener("pointerdown", function (evt) {
    if (evt.target === canvasEl) {
        const mouseX = getMousePositions(evt)["mouseX"];
        const mouseY = getMousePositions(evt)["mouseY"];
        mouseXOld = mouseX;
        mouseYOld = mouseY;
        paint = true;
        addClick(mouseX, mouseY);
        redraw();
    }
});

canvasEl.addEventListener("pointermove", function (evt) {
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
});

canvasEl.addEventListener("pointerup", function (evt) {
    if (evt.target === canvasEl) {
        paint = false;
    }
});

canvasEl.addEventListener("pointerleave", function (evt) {
    if (evt.target === canvasEl) {
        paint = false;
    }
});

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
    elements.forEach(function(el) {
        el.classList.remove("active");
    })
}

// Stroke Style Event Listener *********
const colorsEl = document.querySelectorAll(".settings__color-box");
colorsEl.forEach((item) => {
    item.addEventListener("click", function (evt) {
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
});

// Line Width Event Listener *****
const lineWidthSliderEl = document.querySelector("#line-width__slider");
const curLineWidthEl = document.querySelector("#current-line-width");
curLineWidthEl.innerText = objOptions["curLineWidth"];
lineWidthSliderEl.oninput = function () {
    objOptions["curLineWidth"] = this.value;
    curLineWidthEl.innerText = this.value;
}

// Line Join Button Event Listener *********
const lineJoinEl = document.querySelectorAll(".settings__line-join__options");
lineJoinEl.forEach((item) => {
    item.addEventListener("click", function (evt) {
        if (item.innerText === "ROUND")
            objOptions["curLineJoin"] = "round";
        else if (item.innerText === "BEVEL")
            objOptions["curLineJoin"] = "bevel";
        else if (item.innerText === "MITER")
            objOptions["curLineJoin"] = "miter";
        inactiveAll(lineJoinEl);
        item.classList.toggle("active");
    })
});

function clearArrays(fromIndex) {
    if (fromIndex) {
        console.log(fromIndex);
        objDraw["clickX"].splice(fromIndex);
        objDraw["clickY"].splice(fromIndex);
        objDraw["clickDrag"].splice(fromIndex);
        objDraw["lstStrokeStyle"].splice(fromIndex);
        objDraw["lstLineJoin"].splice(fromIndex);
        objDraw["lstLineWidth"].splice(fromIndex);
    } else {
        objDraw["clickX"] = [];
        objDraw["clickY"] = [];
        objDraw["clickDrag"] = [];
        objDraw["lstStrokeStyle"] = [];
        objDraw["lstLineJoin"] = [];
        objDraw["lstLineWidth"] = [];
    }
}

// Undo Button Event Listener *********
const undoBtnEl = document.querySelector(".draw__btn-undo");
undoBtnEl.addEventListener("click", function (evt) {
    clearArrays(getIndexLastObject());
    redraw();
});

function getIndexLastObject() {
    let lastIndex = objDraw["clickDrag"].length - 1;
    while (lastIndex > 0) {
        if (objDraw["clickDrag"][lastIndex] === undefined) {
            break;
        } else {
            lastIndex--;
        }
    }
    return lastIndex
}

// Reset Button Event Listener *********
const resetBtnEl = document.querySelector(".draw__btn-reset");
resetBtnEl.addEventListener("click", function (evt) {
    clearCanvas();
    clearArrays();
});

// Save Button Event Listener *********
const saveBtnEl = document.querySelector(".draw__btn-save");
saveBtnEl.addEventListener("click", function (evt) {
    const linkEl = document.createElement("a");
    linkEl.download = "my_signature.png";
    linkEl.href = canvasEl.toDataURL();
    linkEl.click();
    linkEl.delete;
});

// Draw Size Event Listener
const drawSizeWidthEl = document.querySelector("#draw-size__width");
const drawSizeHeightEl = document.querySelector("#draw-size__height");
const btnDrawSizeSetEl = document.querySelector(".settings__draw-size__btn-set");
const drawSizeTitleEl = document.querySelector("#current-draw-size");

function updateDrawSizeTitle() {
    drawSizeTitleEl.innerText = `${objDrawSize["width"]} x ${objDrawSize["height"]}`;
    drawSizeWidthEl.style.color = "black";
    drawSizeHeightEl.style.color = "black";
}

drawSizeWidthEl.value = objDrawSize["width"];
drawSizeHeightEl.value = objDrawSize["height"];
updateDrawSizeTitle();

function validateDrawSize(evt) {
    let validDrawSize = true;
    const targetEl = evt.target;
    const targetValue = targetEl.value;
    if (targetValue >= 5 && targetValue <= 500) {
        targetEl.style.color = "green";
        validDrawSize = true;
    } else {
        targetEl.style.color = "red";
        validDrawSize = false
    }
    if(validDrawSize) {
        const sizeWidth = drawSizeWidthEl.value;
        const sizeHeight = drawSizeHeightEl.value;
        canvasEl.width = sizeWidth;
        canvasEl.height = sizeHeight;
        objDrawSize["width"] = sizeWidth;
        objDrawSize["height"] = sizeHeight;
        updateDrawSizeTitle();
        redraw();
    }
}

drawSizeWidthEl.addEventListener("input", validateDrawSize);
drawSizeHeightEl.addEventListener("input", validateDrawSize);

