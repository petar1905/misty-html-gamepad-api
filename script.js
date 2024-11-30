let leftStickInfo = document.getElementById("leftStickInfo");
let rightStickInfo = document.getElementById("rightStickInfo");

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

function gameLoop() {
    try {
        const gamepad = getGamepad();
        const stickValues = readAnalogSticks(gamepad);
        leftStickInfo.innerText = `Left Stick: X=${stickValues[0]}, Y=${stickValues[1]}`;
        rightStickInfo.innerText = `Right Stick: X=${stickValues[2]}, Y=${stickValues[3]}`;
    } catch (error) {
        console.error(error);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();