import stable from "../core/4.0.8/mgba.js";
import latest from "../core/4.0.9/mgba.js";
let Module = null;
let canSync = true;
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
export function timer(isStart) {
    if (isStart) {
        if (timerId) return;
        timerId = setInterval(() => {
            seconds++; count1++;
            if (seconds === 60) [seconds, minutes] = [0, minutes + 1];
            if (minutes === 60) [minutes, hours] = [0, hours + 1];
            document.querySelector("times").textContent = `${hours}h${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`;
            if (count1 === 60) {
                autoSave();
                count1 = 0;
            }
        }, 1000);
    } else {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }
}
export async function autoSave() {
    await Module.saveState(1);
    await FSSync();
    console.log(`Auto save`);
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
    } catch (error) {
        console.error('Sync error:', error);
    } finally {
        setTimeout(() => {
            canSync = true;
        }, 3000);
    }
}
export async function loadGame(romName) {
    await Module.loadGame(`/data/games/${romName}`);
    await delay(100);
    await Module.loadState(1);
    await setDisplay(romName);
    timer(true);

}
export async function buttonPress(key) {
    Module.buttonPress(key)
}
export async function buttonUnpress(key) {
    Module.buttonUnpress(key)
}