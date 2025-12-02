import * as Main from './s-main.js';
// inputGame
async function inputGame(rom) {
    await Main.uploadGame(romInput);
    await delay(200);
    await Main.loadGame(rom.files[0].name);
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
// dot
async function dot() {
    
}
// verticalSetting
async function verSetting(values=[80, 160, 6]) {
    page02.style.paddingTop = `${values[current]}px`;
    values.map(value => `k${value}`).forEach((id, index) => {
        document.getElementById(id).style.stroke = index === current ? "var(--profile-1)" : 'var(--profile-4)';
    });
    localStorage.setItem('vertical', current);
    current = (current + 1) % values.length; 
}
// DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => { verSetting(),listGame() },1000);
    romInput.addEventListener("change", function() {
        inputGame(romInput);
    })
    vertical.addEventListener("click", function() {
        verSetting();
    })
});