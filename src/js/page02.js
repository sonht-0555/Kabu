import * as Main from './s-main.js';
// gamepad
const dpadButtons = ["up", "down", "left", "right", "up-left", "up-right", "down-left", "down-right"];
const otherButtons = ["a", "b", "start", "select", "l", "r"];
let activeDpadTouches = new Map();
let activeOtherTouches = new Map();
function handleButtonPress(buttonId, isPressed) {
    if (!buttonId) return;
    if (buttonId.includes("-")) {
        const [primaryButton, secondaryButton] = buttonId.split("-");
        [primaryButton, secondaryButton].forEach(btn =>
            isPressed ? Main.buttonPress(btn) : Main.buttonUnpress(btn)
        );
    } else {
        isPressed ? Main.buttonPress(buttonId) : Main.buttonUnpress(buttonId);
    }
}
function getButtonIdFromTouch(touch) {
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const button = element?.closest("[id]");
    return button ? button.id : null;
}
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("touchstart", (event) => {
        for (let touch of event.changedTouches) {
            const buttonId = getButtonIdFromTouch(touch);
            if (!buttonId) continue;
            if (dpadButtons.includes(buttonId)) {
                if (activeDpadTouches.has(touch.identifier)) {
                    handleButtonPress(activeDpadTouches.get(touch.identifier), false);
                }
                activeDpadTouches.set(touch.identifier, buttonId);
                handleButtonPress(buttonId, true);
            } else if (otherButtons.includes(buttonId)) {
                if (activeOtherTouches.has(touch.identifier)) {
                    handleButtonPress(activeOtherTouches.get(touch.identifier), false);
                }
                activeOtherTouches.set(touch.identifier, buttonId);
                handleButtonPress(buttonId, true);
            }
        }
    });
    document.addEventListener("touchmove", (event) => {
        for (let touch of event.changedTouches) {
            const buttonId = getButtonIdFromTouch(touch);
            if (!buttonId) continue;

            if (dpadButtons.includes(buttonId)) {
                if (activeDpadTouches.has(touch.identifier) && activeDpadTouches.get(touch.identifier) !== buttonId) {
                    handleButtonPress(activeDpadTouches.get(touch.identifier), false);
                    activeDpadTouches.set(touch.identifier, buttonId);
                    handleButtonPress(buttonId, true);
                }
            } else if (otherButtons.includes(buttonId)) {
                if (activeOtherTouches.has(touch.identifier) && activeOtherTouches.get(touch.identifier) !== buttonId) {
                    handleButtonPress(activeOtherTouches.get(touch.identifier), false);
                    activeOtherTouches.set(touch.identifier, buttonId);
                    handleButtonPress(buttonId, true);
                }
            }
        }
    });
    document.addEventListener("touchend", (event) => {
        for (let touch of event.changedTouches) {
            [activeDpadTouches, activeOtherTouches].forEach(activeTouches => {
                if (activeTouches.has(touch.identifier)) {
                    handleButtonPress(activeTouches.get(touch.identifier), false);
                    activeTouches.delete(touch.identifier);
                }
            });
        }
    });
    document.addEventListener("touchcancel", (event) => {
        for (let touch of event.changedTouches) {
            [activeDpadTouches, activeOtherTouches].forEach(activeTouches => {
                if (activeTouches.has(touch.identifier)) {
                    handleButtonPress(activeTouches.get(touch.identifier), false);
                    activeTouches.delete(touch.identifier);
                }
            });
        }
    });
});