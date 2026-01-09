import stable from "../core/stable/mgba.js";
import latest from "../core/latest/mgba.js";
function initializeCore(coreInitFunction) {
    const coreInstance = { canvas: canvas };
    return coreInitFunction(coreInstance).then((core) => {
        core.FSInit();
        Module = core;
    });
}
export async function timer(isStart) {
    if (isStart) {
        if (timerId) return;
        timerId = setInterval(() => {
            if (++seconds === 60) [seconds, minutes] = [0, ++minutes];
            if (minutes === 60) [minutes, hours] = [0, ++hours];
            document.querySelector("time1").textContent = `${hours}h${minutes.toString().padStart(2, '0')}.${(seconds % 60).toString().padStart(2, '0')}`;
            if (++count1 === 60) { autoSave(); count1 = 0; }
        }, 1000);
    } else if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}
export async function resumeGame() {
    await Module.resumeGame();
    await Module.resumeAudio();
    message("[_] Resumed!");
}
export async function pauseGame() {
    await Module.pauseGame();
    await Module.pauseAudio();
    message("[_] Paused!");
}
export async function autoSave() {
    await Module.saveState(1);
    await FSSync();
    await message(`[${recCount}]_Recorded!`);
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
export async function uploadFiles(romName) {
    Module.uploadRom(romName.files[0], () => {
       Module.FSSync();
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
}
export async function buttonPress(key) {
    Module.buttonPress(key)
}
export async function buttonUnpress(key) {
    Module.buttonUnpress(key);
    Module.SDL2();
}
export async function fastForward(number) {
    await Module.setCoreSettings({time1tepSync: number === 2, videoSync: number === 1});
    await Module.setFastForwardMultiplier(number);
}
export async function editFiles(filepath, filename, newFilename) {
    await Module.editFileName(filepath, filename, newFilename);
    await Module.FSSync()
}
export async function deleteFiles(filepath) {
    await Module.deleteFile(filepath);
    await Module.FSSync()
}
export async function downloadFiles(filepath, filename) {
    const save = Module.downloadFile(filepath);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = filename;
    const blob = new Blob([save], {
        type: "application/octet-stream",
    });
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(blob);
    a.remove();
}
document.addEventListener("DOMContentLoaded", function() {
    initializeCore(latest);
});