import * as Main from './s-main.js';
//inputGame
async function inputGame(rom) {
    await Main.uploadGame(romInput);
    await delay(200);
    await Main.loadGame(rom.files[0].name);
}
//listGame
function showFileGroups(gameName) {
    const fileGroups = [
        { title: "saves", files: Main.listFiles("saves").filter(file => file.startsWith(gameName)) },
        { title: "states", files: Main.listFiles("states").filter(file => file.startsWith(gameName)) },
        { title: "games", files: Main.listFiles("games").filter(file => file.startsWith(gameName)) }
    ];
    list01.innerHTML = fileGroups.map(group => group.files.length ? `${group.files.map(fileName => `<file data="${group.title}"><name>${fileName}</name><edit></edit><down></down><dele></dele></file>`).join('')}<titl>${group.title}</titl>`: '').join('');
    list01.querySelectorAll('edit').forEach(btn => {
        btn.onclick = async () => {
            const nameEl = btn.parentElement.querySelector('name');
            const oldName = nameEl.textContent;
            const newName = window.prompt("Edit filename", oldName);
            if (newName !== null) {
                await Main.editFiles(`/data/${btn.parentElement.getAttribute('data')}/${oldName}`, oldName, newName);
                showFileGroups(gameName);
            }
        };
    });
    list01.querySelectorAll('down').forEach(btn => {
        btn.onclick = () => {

        };
    });
    list01.querySelectorAll('dele').forEach(btn => {
        btn.onclick = async () => {

        };
    });
}
async function listGame() {
    list.innerHTML = Main.listFiles("games")
        .map(gameFileName => `<rom><name>${gameFileName}</name><more></more></rom>`).join('');
    list.querySelectorAll('name').forEach(gameNameElement => {
        gameNameElement.onclick = () => Main.loadGame(gameNameElement.textContent);
    });
    list.querySelectorAll('more').forEach(btn => {
        btn.onclick = () => {
            showFileGroups(btn.parentElement.querySelector('name').textContent.slice(0, -4));
            list.hidden = true;
            list01.hidden = false;
        };
    });
}
//verticalSetting
async function verSetting(values=[80, 160, 6]) {
    page02.style.paddingTop = `${values[current]}px`;
    values.map(value => `k${value}`).forEach((id, index) => {
        document.getElementById(id).style.stroke = index === current ? "var(--profile-1)" : 'var(--profile-4)';
    });
    localStorage.setItem('vertical', current);
    current = (current + 1) % values.length; 
}
//DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => { verSetting(),listGame() },1000);
    romInput.addEventListener("change", function() {
        inputGame(romInput);
    })
    vertical.addEventListener("click", function() {
        verSetting();
    })
});