import * as Main from './s-main.js';
// gamepad
const dpadButtons = ["up", "down", "left", "right", "up-left", "up-right", "down-left", "down-right"];
const otherButtons = ["a", "b", "start", "select", "l", "r"];
let activeDpadTouches  = new Map();
let activeOtherTouches = new Map();
let value = 5, startY = 0, swiping = false, lastTap = 0;
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
    gamepad.addEventListener("touchstart", (e) => {
        for (let touch of e.changedTouches) {
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
    gamepad.addEventListener("touchmove", (e) => {
        for (let touch of e.changedTouches) {
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
    gamepad.addEventListener("touchend", (e) => {
        for (let touch of e.changedTouches) {
            [activeDpadTouches, activeOtherTouches].forEach(activeTouches => {
                if (activeTouches.has(touch.identifier)) {
                    handleButtonPress(activeTouches.get(touch.identifier), false);
                    activeTouches.delete(touch.identifier);
                }
            });
        }
    });
    gamepad.addEventListener("touchcancel", (e) => {
        for (let touch of e.changedTouches) {
            [activeDpadTouches, activeOtherTouches].forEach(activeTouches => {
                if (activeTouches.has(touch.identifier)) {
                    handleButtonPress(activeTouches.get(touch.identifier), false);
                    activeTouches.delete(touch.identifier);
                }
            });
        }
    });
    canvas.addEventListener('touchstart', e => {
        const t = e.touches[0], r = canvas.getBoundingClientRect();
        const now = Date.now();
        const x = t.clientX - r.left, y = t.clientY - r.top;
        if (now - lastTap < 300) {
            x < r.width/2
                ? (y < r.height/2 ? Main.loadState(3) : Main.loadState(2))
                : (y < r.height/2 ? Main.saveState(3) : Main.saveState(2));
        }
        lastTap = now;
        startY = t.clientY;
        swiping = t.clientX > (r.right - 40);
    });
    canvas.addEventListener('touchmove', e => {
        if (!swiping) return;
        const y = e.touches[0].clientY, d = startY - y;
        if (Math.abs(d) >= 20) {
        value = d > 0 ? Math.min(10, value+1) : Math.max(0, value-1);
        gamepad.style.opacity = value / 10;
        message(`Brightness_${value}0.nit`);
        startY = y;
        }
    });
    canvas.addEventListener('touchend', () => {
        swiping = false;
    });

});