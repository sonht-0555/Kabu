import * as Main from './main.js';
//inputGame
async function inputGame(rom) {
    await Main.uploadFiles(romInput);
    await delay(500);
    if (['gba', 'zip', 'gbc', 'gb', 'z7'].includes(rom.files[0].name.split('.').pop().toLowerCase())) {
        await Main.loadGame(rom.files[0].name);
    }
    list.hidden = false, list01.hidden = true, list02.hidden = true;
    listGame();
}
//listGame
function showFileGroups(gameName) {
    const fileGroups = [
        { title: "saves", files: Main.listFiles("saves").filter(file => file.startsWith(gameName)) },
        { title: "states", files: Main.listFiles("states").filter(file => file.startsWith(gameName)) },
        { title: "games", files: Main.listFiles("games").filter(file => file.startsWith(gameName)) }
    ];
    list01.innerHTML = fileGroups.map(group => group.files.length ? `${group.files.map(fileName => `<file data="${group.title}"><name>${fileName}</name><dele></dele></file>`).join('')}<titl>${group.title}.</titl>`: '').join('');
    list01.querySelectorAll('name').forEach(btn => {
        btn.onclick = async () => {
            const nameEl = btn.parentElement.querySelector('name').textContent;
            if (window.confirm(`Download this file?  ${nameEl}`)) {
                Main.downloadFiles(`/data/${btn.parentElement.getAttribute('data')}/${nameEl}`, nameEl);
                showFileGroups(gameName);
            }
        };
    });
    list01.querySelectorAll('dele').forEach(btn => {
        btn.onclick = async () => {
            const nameEl = btn.parentElement.querySelector('name').textContent;
            if (window.confirm(`Delete this file?  ${nameEl}`)) {
                Main.deleteFiles(`/data/${btn.parentElement.getAttribute('data')}/${nameEl}`);
                showFileGroups(gameName);
            }
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
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
        });
        navigator.serviceWorker.addEventListener('message', async function (event) {
        if (event.data.msg === "Updating...") {
            ver.textContent = "The system is updating...";
            setTimeout(() => {location.reload()},4000);
            }
        });
    }
    setTimeout(() => {verSetting(),listGame()},2000);
    romInput.addEventListener("change", function() {
        inputGame(romInput);
    })
    vertical.addEventListener("click", function() {
        verSetting();
    })
    logo.addEventListener("click", function() {
        list.hidden = false, list01.hidden = true, list02.hidden = true;
        listGame();
    })
});