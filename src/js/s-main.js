import stable from "../core/4.0.8/mgba.js";
import latest from "../core/4.0.9/mgba.js";
function initializeCore(coreInitFunction) {
    const coreInstance = { canvas: canvas };
    return coreInitFunction(coreInstance).then((core) => {
        core.FSInit();
        Module = core;
        Module.setCoreSettings({
            rewindEnable: false,
            timestepSync: false,     
            videoSync: true, 
            autoSaveStateEnable: false,
            restoreAutoSaveStateOnLoad: false,
            autoSaveStateTimerIntervalSeconds: 0, 
            audioBufferSize: 2048,      
        });
    });
}    
initializeCore(stable);
export async function timer(isStart) {
    if (isStart) {
        if (timerId) return;
        timerId = setInterval(() => {
            if (++seconds === 60) [seconds, minutes] = [0, ++minutes];
            if (minutes === 60) [minutes, hours] = [0, ++hours];
            document.querySelector("times").textContent = `${hours}h${minutes.toString().padStart(2, '0')}.${(seconds % 60).toString().padStart(2, '0')}`;
            if (++count1 === 60) { autoSave(); Module.SDL2(); count1 = 0; }
        }, 1000);
    } else if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}
export async function autoSave() {
    await Module.saveState(1);
    await FSSync();
    await message(`[${recCount}]_Recorded`);
    recCount++;
}
export async function saveState(slot) {
    await Module.pauseGame();
    canvas.setAttribute('op8', ''); 
    await Module.saveState(slot);
    await FSSync();
    await message(`[ss${slot}]_Recorded!`, 1000);
    canvas.removeAttribute('op8');  
    await Module.resumeGame();
}
export async function loadState(slot) {
    await Module.loadState(slot);
    await message(`[ss${slot}]_Loaded!`, 1000);
}
export async function uploadGame(romName) {
    const file = romName.files[0];
    Module.uploadRom(file, () => {
        FSSync();
    });
}
export function listFiles(name) {
    const result = Module.listFiles(name).filter((file) => file !== "." && file !== "..");
    return result;
}
export async function FSSync() {
    if (!canSync) return;
    canSync = false;
    try {
        await Module.FSSync();
    } finally {
        setTimeout(() => { canSync = true; }, 3000);
    }
}
export async function loadGame(romName) {
    await Module.loadGame(`/data/games/${romName}`);
    await delay(200);
    await Module.loadState(1);
    await gameView(romName);
    await timer(true);
    await Module.SDL2();
}
export async function buttonPress(key) {
    Module.buttonPress(key)
}
export async function buttonUnpress(key) {
    Module.buttonUnpress(key)
}
export async function fastForward(number) {
    Module.setFastForwardMultiplier(number);
}