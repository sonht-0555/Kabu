import * as Main from './main.js';
let value = 5, startY = 0, swiping = false, lastTap = 0, turboState = 1, active = null;
function handleButton(press, element) {
    const parts = element?.getAttribute('data')?.split('-').slice(1) || [];
    parts.forEach(part => press ? Main.buttonPress(part) : Main.buttonUnpress(part));
}
function setState(element) {
    if (element === active) return;
    active && handleButton(false, active);
    active = element || null;
    handleButton(true, element);
}
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('pointerdown', (e) => {
        setState(e.target.closest('[data]'));
    });
    document.addEventListener('pointermove', (e) => {
        active && (() => {
            const element = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data]');
            element && element !== active &&
                active.getAttribute('data').split('-')[0] === element.getAttribute('data').split('-')[0] &&
                setState(element);
        })();
    });
    canvas.addEventListener('pointerdown', (e) => {
        const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (Date.now() - lastTap < 250) {
            x < r.width / 2 ? (y < r.height / 2 ? Main.loadState(3) : Main.loadState(2)) : (y < r.height / 2 ? Main.saveState(3) : Main.saveState(2));
        }
        lastTap = Date.now(), startY = e.clientY, swiping = e.clientX > (r.right - 40);
    });
    canvas.addEventListener('pointermove', (e) => {
        if (!swiping) return;
        if (Math.abs(startY - e.clientY) >= 20) {
            value = startY - e.clientY > 0 ? Math.min(10, value + 1) : Math.max(0, value - 1);
            gamepad.style.opacity = value / 10;
            message(`Brightness_${value}0.nit`);
            startY = e.clientY;
        }
    });
    f.addEventListener('pointerdown', (e) => {
        if (Date.now() - lastTap < 250) {
            turboState = turboState === 1 ? 3 : 1;
            Main.fastForward(turboState);
            f.classList.toggle("active");
            message(`[${turboState}x] Speed!`);
        }
        lastTap = Date.now();
    });
    joypad.addEventListener('pointerdown', (e) => {
        joypad.style.opacity = "1";
    });
   ['pointerup', 'pointercancel'].forEach(type => addEventListener(type, () => { setState(null); swiping = false; joypad.style.opacity = "0" })
);
});