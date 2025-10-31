import * as Main from './s-main.js';

// gamepad
function buttonPress(buttonName, isPress) {
    if (buttonName.includes("-")) {
        const [primaryButton, secondaryButton] = buttonName.split("-");
        [primaryButton, secondaryButton].forEach(btn =>
            isPress ? Main.buttonPress(btn) : Main.buttonUnpress(btn)
        );
    } else {
        isPress ? Main.buttonPress(buttonName) : Main.buttonUnpress(buttonName);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const dpadButtons = ["up", "down", "left", "right", "up-left", "up-right", "down-left", "down-right"];
    const otherButtons = ["a", "b", "start", "select", "l", "r"];
    const activeTouches = { dpad: new Map(), other: new Map() };

    function handleButtonPress(buttonId, isPressed) {
        if (buttonId) buttonPress(buttonId, isPressed);
    }

    function getButtonIdFromTouch(touch) {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        return element?.closest("[id]")?.id || null;
    }

    function processTouches(touches, isPressed) {
        for (let touch of touches) {
            const buttonId = getButtonIdFromTouch(touch);
            if (!buttonId) continue;

            const group = dpadButtons.includes(buttonId) ? "dpad" : otherButtons.includes(buttonId) ? "other" : null;
            if (!group) continue;

            const activeGroup = activeTouches[group];
            if (activeGroup.has(touch.identifier) && activeGroup.get(touch.identifier) !== buttonId) {
                handleButtonPress(activeGroup.get(touch.identifier), false);
            }

            if (isPressed) {
                activeGroup.set(touch.identifier, buttonId);
                handleButtonPress(buttonId, true);
            } else {
                handleButtonPress(activeGroup.get(touch.identifier), false);
                activeGroup.delete(touch.identifier);
            }
        }
    }

    document.addEventListener("touchstart", (event) => processTouches(event.changedTouches, true));
    document.addEventListener("touchmove", (event) => processTouches(event.changedTouches, true));
    document.addEventListener("touchend", (event) => processTouches(event.changedTouches, false));
    document.addEventListener("touchcancel", (event) => processTouches(event.changedTouches, false));
});