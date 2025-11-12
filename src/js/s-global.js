tag("page01"), tag("page02"), tag("notif"), tag("display"), tag("list"), tag("name"), tag("canvas"), tag("gamepad"), tag("l-button"), tag("r-button"), tag("start-button"), tag("select-button"), tag("titles"), tag("vertical");
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
async function firstView() {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) {
        document.querySelectorAll('name, wrap-button, b-button, dpad-section, l-button, r-button, start-button, select-button, f-button, state-button, menu-button').forEach(el => el.classList.add('night-mode'));
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
    display.style.height = `${Math.ceil(gameHeight * integer) + 10}px`;
    display.style.width  = `${gameWidth  * integer}px`;
    canvas.style.height  = `${gameHeight * integer}px`;
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
document.addEventListener("DOMContentLoaded", function() {
    
});