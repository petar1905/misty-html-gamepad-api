let leftStickInfo = document.getElementById("leftStickInfo");
let rightStickInfo = document.getElementById("rightStickInfo");
let headRotationInfo = document.getElementById("headRotationInfo");


let headRotation = [0, 0];

function getGamepad() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            return gamepads[i];
        }
    }
    throw Error("Gamepad not found.");
}

function readAnalogSticks(gamepad) {
    const leftStickX = gamepad.axes[0];
    const leftStickY = gamepad.axes[1];
    const rightStickX = gamepad.axes[2];
    const rightStickY = gamepad.axes[3];
    return [leftStickX, leftStickY, rightStickX, rightStickY];
}

function mapAnalogValues(x, y) {
    const minX = -1;
    const maxX = 1;
    const minY = -100;
    const maxY = 100;
    const scaledX = Math.floor((x - minX) / (maxX - minX) * (maxY - minY) + minY);
    const scaledY = Math.floor((y - minX) / (maxX - minX) * (maxY - minY) + minY);
    return [scaledX, scaledY];
  }

function gameLoop() {
    try {
        const gamepad = getGamepad();
        const stickValues = readAnalogSticks(gamepad);
        const headValues = mapAnalogValues(stickValues[2], stickValues[3]);
        headRotation[0] += headValues[0]
        headRotation[1] += headValues[1]
        leftStickInfo.innerText = `Left Stick: X=${stickValues[0]}, Y=${stickValues[1]}`;
        rightStickInfo.innerText = `Right Stick: X=${stickValues[2]}, Y=${stickValues[3]}`;
        headRotationInfo.innerText = `Head Rotation: X=${headRotation[0]}, Y=${headRotation[1]}`;
    } catch (error) {
        console.error(error);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();