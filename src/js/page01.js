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
// verticalSetting
let current = parseInt(localStorage.getItem('verticalCurrent')) || 0;
async function verSetting(values=[80, 160, 0]) {
    page02.style.paddingTop = `${values[current]}px`;
    values.map(value => `k${value}`).forEach((id, index) => {
        document.getElementById(id).style.fill = index === current ? "var(--profile-1)" : 'var(--profile-3)';
    });
    localStorage.setItem('verticalCurrent', current);
    current = (current + 1) % values.length; 
}
// DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => { verSetting(),listGame(),firstView() },1000);
    romInput.addEventListener("change", function() {
        inputGame(romInput);
    })
    vertical.addEventListener("click", function() {
        verSetting();
    })
});