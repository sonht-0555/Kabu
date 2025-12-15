import * as Main from './main.js';
let value = 5, startY = 0, swiping = false, lastTap = 0, number = 1, active = null;
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
    document.onpointerdown = e => {
        setState(e.target.closest('[data]'));
    };
    document.onpointermove = e => {
        active && (() => {
            const element = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data]');
            element && element !== active &&
                active.getAttribute('data').split('-')[0] === element.getAttribute('data').split('-')[0] &&
                setState(element);
        })();
    };
    canvas.onpointerdown = e => {
        const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (Date.now() - lastTap < 300) {
            x < r.width / 2 ? (y < r.height / 2 ? Main.loadState(3) : Main.loadState(2)) : (y < r.height / 2 ? Main.saveState(3) : Main.saveState(2));
        }
        lastTap = Date.now(), startY = e.clientY, swiping = e.clientX > (r.right - 40);
    };
    canvas.onpointermove = e => {
        if (!swiping) return;
        if (Math.abs(startY - e.clientY) >= 20) {
            value = startY - e.clientY > 0 ? Math.min(10, value + 1) : Math.max(0, value - 1);
            gamepad.style.opacity = value / 10;
            message(`Brightness_${value}0.nit`);
            startY = e.clientY;
        }
    };
    f.onpointerdown = e => {
        if (Date.now() - lastTap < 300) {
            number = number === 1 ? 2 : 1;
            Main.fastForward(number);
            f.classList.toggle("active");
            message(`[${number}x] Speed!`);
        }
        lastTap = Date.now();
    };
    state.onpointerdown = e => {
        if (Date.now() - lastTap < 300) {
            const input = prompt("Format [shaderxx-data]");
            input && local(...((() => { const [name, ...dataParts] = input.split('-'); return [name, dataParts.join('-')]; })()));
        } else {
            number = number % 5 + 1;
            local("shader", number);
            const shader = local(`shader0${number}`) || "0.0.0.1.0.0.1.0.0.1.0.0.1.0.0.0";
            screen.style.setProperty("--shader", svgGen(integer, shader)); 
            message(`[${shader}_0${number}] Matrix!`);
        }
        lastTap = Date.now();
    };
    joypad.onpointerdown = e => {
        joypad.style.opacity = "1";
    };
    invis.onpointerdown = e => {
        screen.style.opacity = "0"
    };
    ['pointerup', 'pointercancel'].forEach(type => addEventListener(type, () => { setState(null); swiping = false; joypad.style.opacity = "0"}));
    document.onvisibilitychange = () => !document.hidden && (screen.style.opacity = "1");
});