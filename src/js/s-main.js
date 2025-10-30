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
    await Module.loadState(1);
    await setDisplay(romName);
}