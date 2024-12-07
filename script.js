const leftStickInfo = document.getElementById("leftStickInfo");
const rightStickInfo = document.getElementById("rightStickInfo");
const headRotationInfo = document.getElementById("headRotationInfo");
const driveInfo = document.getElementById("driveInfo");
const sensitivity = 0.02;
const deadzone = 0.1;
let ip = prompt("What is Misty's IP address?");
let headRotation = [0, 0];

let framesToMove = 0;

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

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function moveMistysHead(ip, pitch, yaw) {
    if (++framesToMove == 180) {
        fetch(`http://${ip}/api/head`, {
            method: "POST",
            body: JSON.stringify({
                "Pitch": pitch,
                "Yaw": yaw,
                "Velocity": 100
            })
        });
        framesToMove = 0;
    }
}

function gameLoop() {
    try {
        const gamepad = getGamepad();
        const stickValues = readAnalogSticks(gamepad, deadzone);
        const headValues = mapAnalogValues(stickValues[2], stickValues[3]);
        headRotation[0] += headValues[0]*sensitivity;
        headRotation[0] = clamp(headRotation[0], -100, 100);
        headRotation[1] += headValues[1]*sensitivity;
        headRotation[1] = clamp(headRotation[1], -100, 100);
        const driveValues = mapAnalogValues(stickValues[0], stickValues[1]);
        leftStickInfo.innerText = `Left Stick: X=${stickValues[0]}, Y=${stickValues[1]}`;
        rightStickInfo.innerText = `Right Stick: X=${stickValues[2]}, Y=${stickValues[3]}`;
        driveInfo.innerText = `Drive: LinearVelocity=${driveValues[1]}, AngularVelocity=${driveValues[0]}`
        headRotationInfo.innerText = `Head Rotation: Yaw=${-Math.trunc(headRotation[0])}, Pitch=${Math.trunc(headRotation[1])}`;
        moveMistysHead(ip, Math.trunc(headRotation[1]), -Math.trunc(headRotation[0]));
    } catch (error) {
        console.error(error);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();