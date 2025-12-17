tag("body"), tag("page00"), tag("page01"), tag("page02"), tag("logo"), tag("page02"), tag("notification"), tag("display"), tag("list"), tag("list01"), tag("list02"), tag("name"), tag("ver"), tag("gamepad"), tag("title1"), tag("vertical"), tag("screen"), tag("invis"), tag("joypad"), tag("green0"), tag("white0"), tag("message0");
let gameName, gameType, gameWidth, gameHeight, integer, timerId, count = null, Module = null, canSync = true, recCount = 1, isReload = false, swipe;
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
function svgGen(repeat, size, string) {
    const N = repeat * size;
    const c = document.createElement('canvas');
    c.width = c.height = N;
    const ctx = c.getContext('2d');
    const cells = string.split('.');
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (cells[(i % size) * size + (j % size)] === '1') {
                ctx.fillRect(j, i, 1, 1);
            }
        }
    }
    return `url(${c.toDataURL()})`;
}
async function message(mess, second = 2000) {
    if (count) count.cancelled = true;
    const task = { cancelled: false };
    count = task;
    title1.textContent = mess;
    await delay(second);
    if (!task.cancelled && count === task) {
        title1.textContent = gameName;
        count = null;
    }
}
async function notifi(green, white, message) {
    page00.hidden = false;
    green0.textContent = green;
    white0.textContent = white;
    message0.textContent = message;
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
    screen.style.setProperty("--size", `${integer}px`);
    // notification
    title1.textContent = gameName;
    // gamepad
    const base = Math.round((window.innerWidth - 12 - 8 - 16) / 8);
    const adjust = base % 2 === 0 ? base - 1 : base;
    gamepad.style.gridTemplateColumns = `${adjust}px 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px 1px auto 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px`;
    page02.style.gridTemplateRows  =  `auto ${window.innerWidth - (adjust * 8 + 8) - 12}px ${(adjust * 4) + 4 + 8 + 26}px 1fr 10px`;
    joy.style.width = `${(adjust * 4 + 3)}px`;
    // action
    page01.hidden = true;
    page02.hidden = false;
    screen.style.setProperty("--shader", svgGen(window.devicePixelRatio, integer, local(`shader0${local("shader")}`) || "0.0.0.1.0.0.1.0.0.1.0.0.1.0.0.0"));
}
document.addEventListener("DOMContentLoaded", function(){
    body.style.setProperty("--background", svgGen(1, window.devicePixelRatio, "0.0.1.0.1.0.1.0.0"));
});