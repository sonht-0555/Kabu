tag("body"), tag("page01"), tag("logo"), tag("page02"), tag("notif"), tag("display"), tag("list"), tag("list01"), tag("list02"), tag("name"), tag("ver"), tag("gamepad"), tag("titles"), tag("vertical"), tag("screen");
let gameName, gameType, gameWidth, gameHeight, integer, timerId, count = null, Module = null, canSync = true, recCount = 1, isReload = false;
const canvas = document.getElementById('canvas');
let [hours, minutes, seconds, count1] = [0, 0, 0, 0, 0];
let current = parseInt(local('vertical')) || 0;
function tag(selector) {
    const element = document.querySelector(selector)
    window[selector] = element;
    return element;
}
function local(key, value) {
    return arguments.length < 2 || value === null
        ? localStorage.getItem(key)
        : localStorage.setItem(key, value);
}
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function svgGen(N, matrixString) {
    let svgContent = `<svg width="1" height="1" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">`;
    const cells = matrixString.split('.');
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            svgContent += `<rect x="${j / N}" y="${i / N}" width="${1 / N}" height="${1 / N}" fill="${cells[i * N + j] === '1' ? 'black' : 'none'}" />`;
        }
    }
    svgContent += `</svg>`;
    const encoded = encodeURIComponent(svgContent);
    return `url("data:image/svg+xml,${encoded}")`;
}
async function message(mess, second = 2000) {
    if (count) count.cancelled = true;
    const task = { cancelled: false };
    count = task;
    titles.textContent = mess;
    await delay(second);
    if (!task.cancelled && count === task) {
        titles.textContent = gameName;
        count = null;
    }
}
async function gameView(romName) {
    // global
    page02.ontouchstart = (e) => { e.preventDefault(); }
    // display
    [gameName, gameType] = [romName.slice(0, -4), romName.slice(-3)];
    [gameWidth, gameHeight] = (gameType === "zip" || gameType === ".7z" || gameType === "gba") ? [240, 160] : [160, 144];
    integer = Math.floor((window.innerWidth * window.devicePixelRatio) / gameWidth);
    display.style.height = `${Math.ceil(gameHeight * (integer/window.devicePixelRatio)) + 10}px`;
    display.style.width  = `${gameWidth  * (integer/window.devicePixelRatio)}px`;
    screen.style.setProperty("--width", `${gameWidth * integer}px`);
    screen.style.setProperty("--height", `${gameHeight * integer}px`);
    screen.style.setProperty("--scale", integer / ( window.devicePixelRatio * integer));     
    // notification
    titles.textContent = gameName;
    // gamepad
    const base = Math.round((window.innerWidth - 12 - 8 - 16) / 8);
    const adjust = base % 2 === 0 ? base - 1 : base;
    gamepad.style.gridTemplateColumns = `${adjust}px 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px 1px auto 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px`;
    page02.style.gridTemplateRows  =  `auto ${window.innerWidth - (adjust * 8 + 8) - 12}px ${(adjust * 4) + 4 + 8 + 26}px 1fr`;
    joypad.style.width = `${(adjust * 4 + 3)}px`;
    // action
    page01.hidden = true;
    page02.hidden = false;
}
document.addEventListener("DOMContentLoaded", function(){
    body.style.setProperty("--background", svgGen(3, "0.0.1.0.1.0.1.0.0"));
    screen.style.setProperty("--shader", svgGen(4, local(`shader0${local("shader")}`) || "0.0.0.1.0.0.1.0.0.1.0.0.1.0.0.0")); 
});