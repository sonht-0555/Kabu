tag("body"), tag("page01"), tag("logo"), tag("page02"), tag("notif"), tag("display"), tag("list"), tag("list01"), tag("list02"), tag("name"), tag("ver"), tag("gamepad"), tag("titles"), tag("vertical");
let gameName, gameType, gameWidth, gameHeight, integer, timerId, count = null, Module = null, canSync = true, recCount = 1, isReload = false;
const canvas = document.getElementById('canvas');
let [hours, minutes, seconds, count1] = [0, 0, 0, 0, 0];
let current = parseInt(localStorage.getItem('vertical')) || 0;
function tag(selector) {
    const element = document.querySelector(selector)
    window[selector] = element;
    return element;
}
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function svgGen(N) {
    if (N <= 0) return '';
    const rects = [];
    const size = 1 / N; 
    for (let i = 0; i < N; i++) {
        const x = (i * size).toFixed(3); 
        const y = ((N - 1 - i) * size).toFixed(3); 
        const size_str = size.toFixed(3);
        const rectString = `<rect x='${x}' y='${y}' width='${size_str}' height='${size_str}' fill='black'/>`;
        rects.push(rectString);
    }
    const svgContent = `<svg xmlns='http://www.w3.org/2000/svg' width="1" height="1" viewBox='0 0 1 1'>${rects.join('')}</svg>`;
    let encodedSvg = svgContent
        .replace(/'/g, '"').replace(/#/g, '%23').replace(/"/g, "'"); 
    return `url("data:image/svg+xml,${encodedSvg}")`;
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
    display.style.setProperty("--width", `${gameWidth}px`);
    display.style.setProperty("--height", `${gameHeight}px`);
    display.style.setProperty("--scale", integer / window.devicePixelRatio);     
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
    body.style.setProperty("--background", svgGen(window.devicePixelRatio)); 
});