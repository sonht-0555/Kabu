import * as Main from './s-main.js';
// inputGame
async function inputGame(InputFile) {
    await Main.uploadGame(romInput);
    await delay(100);
    await Main.loadGame(InputFile.files[0].name);
}
// listGame
async function listGame() {
    Main.listFiles("games").forEach((file) => {
        const rom = document.createElement("rom"); 
        list.appendChild(rom);
        const name = document.createElement("name");
        name.onclick = () => {Main.loadGame(file)}; 
        name.textContent = file;
        rom.appendChild(name);
        const more = document.createElement("more"); 
        rom.appendChild(more);
    });
};
// DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => { listGame() },1000);
    romInput.addEventListener("change", function() {
        inputGame(romInput);
    })
});