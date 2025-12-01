import * as Main from './s-main.js';
const dpadButtons = ["up", "down", "left", "right", "up-left", "up-right", "down-left", "down-right"];
const otherButtons = ["a", "b", "start", "select", "l", "r"];
let activeDpadTouches  = new Map(), activeOtherTouches = new Map();
let value = 5, startY = 0, swiping = false, lastTap = 0, turboState = 1;
function  buttonPress(btn){
    btn.id.split('-').forEach(part => Main.buttonPress(part));
  };
function buttonUnpress(btn){
    btn.id.split('-').forEach(part => Main.buttonUnpress(part));
  }
let active = null;
function setActive(btn){
  if (active === btn) return;
  active && buttonUnpress(active);
  active = btn;
  buttonPress(btn);
}
function deactivate(){
  active && (buttonUnpress(active), active = null);
}
document.addEventListener("DOMContentLoaded", function() {
    gamepad.addEventListener('pointerdown', e => {
    const btn = e.target.closest('.btn, .func'); btn && setActive(btn);
    });
    gamepad.addEventListener('pointermove', e => {
    if (!active) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const sameGroup =
        (active.classList.contains('btn') && el.classList.contains('btn')) ||
        (active.classList.contains('func') && el.classList.contains('func'));
    if (sameGroup && el !== active && (el.classList.contains('btn') || el.classList.contains('func'))) {
        setActive(el);
    }
    });
    ['pointerup','pointercancel'].forEach(t => gamepad.addEventListener(t, deactivate));
    canvas.addEventListener("touchstart", (e) => {
        const t = e.touches[0], r = canvas.getBoundingClientRect();
        const now = Date.now();
        const x = t.clientX - r.left, y = t.clientY - r.top;
        if (now - lastTap < 250) {
            x < r.width/2
                ? (y < r.height/2 ? Main.loadState(3) : Main.loadState(2))
                : (y < r.height/2 ? Main.saveState(3) : Main.saveState(2));
        }
        lastTap = now;
        startY = t.clientY;
        swiping = t.clientX > (r.right - 40);
    });
    canvas.addEventListener("touchmove", (e) => {
        if (!swiping) return;
        const y = e.touches[0].clientY, d = startY - y;
        if (Math.abs(d) >= 20) {
        value = d > 0 ? Math.min(10, value+1) : Math.max(0, value-1);
        gamepad.style.opacity = value / 10;
        message(`Brightness_${value}0.nit`);
        startY = y;
        }
    });
    canvas.addEventListener("touchend", () => {
        swiping = false;
    });
    f.addEventListener("touchstart", () => {
        const now = Date.now();
        if (now - lastTap < 250) {
            turboState = turboState % 2 + 1;
            Main.fastForward(turboState);
            f.classList.toggle("active");
            message(`[${turboState}x] Speed!`);
        }
        lastTap = now;
    });
});