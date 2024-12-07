const leftStickInfo = document.getElementById("leftStickInfo");
const rightStickInfo = document.getElementById("rightStickInfo");
const headRotationInfo = document.getElementById("headRotationInfo");
const sensitivity = 0.02;
const deadzone = 0.1;
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

function readAnalogSticks(gamepad, deadzone) {
    let leftStickX = gamepad.axes[0];
    if (leftStickX < deadzone && leftStickX > -deadzone) leftStickX = 0;
    let leftStickY = gamepad.axes[1];
    if (leftStickY < deadzone  && leftStickY > -deadzone) leftStickY = 0;
    let rightStickX = gamepad.axes[2];
    if (rightStickX < deadzone  && rightStickX > -deadzone) rightStickX = 0;
    let rightStickY = gamepad.axes[3];
    if (rightStickY < deadzone  && rightStickY > -deadzone) rightStickY = 0;
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
        const stickValues = readAnalogSticks(gamepad, deadzone);
        const headValues = mapAnalogValues(stickValues[2], stickValues[3]);

        for (let i = 0; i < 1; ++i) {
            if (headValues[i] < 0 && headRotation[i] > -100) {
                headRotation[i] += headValues[i]*sensitivity;
            } else if (headValues[i] > 0 && headRotation[i] < 100) {
                headRotation[i] += headValues[i]*sensitivity;
            }
        }
        if (headValues[1] < 0 && headRotation[1])
        headRotation[1] += headValues[1]*sensitivity;
        leftStickInfo.innerText = `Left Stick: X=${stickValues[0]}, Y=${stickValues[1]}`;
        rightStickInfo.innerText = `Right Stick: X=${stickValues[2]}, Y=${stickValues[3]}`;
        headRotationInfo.innerText = `Head Rotation: X=${Math.trunc(headRotation[0])}, Y=${Math.trunc(headRotation[1])}`;
    } catch (error) {
        console.error(error);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();