tag("page01"), tag("page02"), tag("notif"), tag("display"), tag("list"), tag("name"), tag("canvas"), tag("gamepad"), tag("l-button"), tag("r-button"), tag("start-button"), tag("select-button"), tag("dpad-section"), tag("titles"), tag("vertical");
let gameName, gameType, gameWidth, gameHeight, integer, timerId;
let [hours, minutes, seconds, count1] = [0, 0, 0, 0, 0];
function tag(selector) {
    const element = document.querySelector(selector)
    window[selector] = element;
    return element;
}
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function led(slot) {
    ['led1', 'led2', 'led3'].forEach(id => {
        document.getElementById(id)?.classList.toggle('active', id === `led${slot}`);
    });
    setTimeout(() => { document.getElementById(`led${slot}`)?.classList.remove('active'); }, 4000);
}
async function firstView() {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) {
        document.querySelectorAll('name, wrap-button, a-button, b-button, dpad-section, l-button, r-button, start-button, select-button, f-button, state-button, menu-button').forEach(el => el.classList.add('night-mode'));
    }
}
async function gameView(romName) {
    // global
    page02.ontouchstart = (e) => {
        e.preventDefault();
    }
    // display
    [gameName, gameType] = [romName.slice(0, -4), romName.slice(-3)];
    [gameWidth, gameHeight] = (gameType === "zip" || gameType === "gba") ? [240, 160] : [160, 144];
    integer = Math.floor((window.innerWidth * window.devicePixelRatio) / gameWidth) / window.devicePixelRatio;
    canvas.style.height  = `${gameHeight * integer}px`;
    display.style.height = `${Math.ceil(gameHeight * integer) + 10}px`;
    display.style.width  = `${gameWidth  * integer}px`;
    display.style.setProperty("--width", `${gameWidth}px`);
    display.style.setProperty("--height", `${gameHeight}px`);
    display.style.setProperty("--scale", integer);
    console.log(integer)
    // notification
    titles.textContent = gameName
    // gamepad
    const base = Math.round((window.innerWidth - 12 - 8 - 16) / 8);
    const adjust = base % 2 === 0 ? base - 1 : base;
    gamepad.style.gridTemplateColumns = `${adjust}px 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px 1px auto 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px`;
    page02.style.gridTemplateRows  =  `auto ${window.innerWidth - (adjust * 8 + 8) - 12}px ${(adjust * 4) + 4 + 8 + 24}px 1fr`
    page01.hidden = true;
    page02.hidden = false;
}
const canvass = document.getElementById('myCanvas');
        const ctx = canvass.getContext('2d');
        const tileSize = 4;
        function draw(x, y) {
            ctx.fillStyle = 'black';
            ctx.fillRect(x + 3, y + 0, 1, 1); // Pixel (3, 0)
            ctx.fillRect(x + 2, y + 1, 1, 1); // Pixel (2, 1)
            ctx.fillRect(x + 1, y + 2, 1, 1); // Pixel (1, 2)
            ctx.fillRect(x + 0, y + 3, 1, 1); // Pixel (0, 3)
        }
        for (let y = 0; y < canvass.height; y += tileSize) {
            for (let x = 0; x < canvass.width; x += tileSize) {
                draw(x, y);
            }
}
document.addEventListener("DOMContentLoaded", function() {
    
});