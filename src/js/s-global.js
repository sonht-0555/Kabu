tag("page01"), tag("page02"), tag("notif"), tag("display"), tag("list"), tag("name"), tag("canvas"), tag("gamepad");
let gameName, gameType, gameWidth, gameHeight, integer;
function tag(selector) {
    const element = document.querySelector(selector)
    window[selector] = element;
    return element;
}
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function setDisplay(romName) {
    // display
    [gameName, gameType] = [romName.slice(0, -4), romName.slice(-3)];
    [gameWidth, gameHeight] = (gameType === "zip" || gameType === "gba") ? [240, 160] : [160, 144];
    integer = Math.floor((window.innerWidth * window.devicePixelRatio) / gameWidth) / window.devicePixelRatio;
    display.style.height = `${Math.ceil(gameHeight * integer) + 20}px`;
    display.style.width  = `${gameWidth  * integer}px`;
    canvas.style.height  = `${gameHeight * integer}px`;
    // gamepad
    const base = Math.round((window.innerWidth - 12 - 8 - 16) / 8);
    const adjust = base % 2 === 0 ? base - 1 : base;
    gamepad.style.gridTemplateColumns = `${adjust}px 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px 1px auto 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px 1px ${adjust}px`;
    page02.style.gridTemplateRows  =  `auto ${window.innerWidth - (adjust * 8 + 8) - 12}px ${(adjust * 4) + 4 + 8 + 24}px 1fr`
    page01.hidden = true;
    page02.hidden = false;
}
function adjust() {
    
}
document.addEventListener("DOMContentLoaded", function() {
    adjust();
});