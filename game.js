let score = 0;
let helpers = 0;
let factories = 0;
let superfactories = 0;
const scoreDiv = document.getElementById('score');
const cookieBtn = document.getElementById('cookie');
const buyHelperBtn = document.getElementById('buy-helper');
const helpersDiv = document.getElementById('helpers');
const stopHelpersBtn = document.getElementById('stop-helpers');
const startHelpersBtn = document.getElementById('start-helpers');
const buyFactoryBtn = document.getElementById('buy-factory');
const factoriesDiv = document.getElementById('factories');
const buySuperFactoryBtn = document.getElementById('buy-superfactory');
const superfactoriesDiv = document.getElementById('superfactories');
const openShopBtn = document.getElementById('open-shop');
const shopModal = document.getElementById('shop-modal');
const closeShopBtn = document.getElementById('close-shop');
const buySuperSpeedBtn = document.getElementById('buy-super-speed');
const superSpeedStatusDiv = document.getElementById('super-speed-status');
let helpersActive = true;
let factoriesActive = true;
let superSpeedActive = false;
let superSpeedTimeout = null;
let superSpeedEndTime = 0;

function clickCookie() {
    score++;
    updateAndSave();
    cookieBtn.classList.add('clicked');
    setTimeout(() => {
        cookieBtn.classList.remove('clicked');
    }, 100);
    // Murusten lentäminen
    const crumbsContainer = document.getElementById('crumbs-container');
    const rect = cookieBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const crumb = document.createElement('div');
        crumb.className = 'crumb';
        // Satunnainen lentorata napin ulkopuolelle
        const distance = 120 + Math.random() * 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const rot = `${Math.floor(Math.random() * 360)}deg`;
        crumb.style.setProperty('--crumb-x', `${x}px`);
        crumb.style.setProperty('--crumb-y', `${y}px`);
        crumb.style.setProperty('--crumb-rot', rot);
        crumb.style.left = `${centerX - 10}px`;
        crumb.style.top = `${centerY - 18}px`;
        crumbsContainer.appendChild(crumb);
        setTimeout(() => {
            crumb.remove();
        }, 700);
    }
}

cookieBtn.addEventListener('click', clickCookie);

function animateShopButton(btn) {
    btn.classList.add('clicked');
    setTimeout(() => {
        btn.classList.remove('clicked');
    }, 120);
}

buyHelperBtn.addEventListener('click', () => {
    if (score >= 70) {
        score -= 70;
        helpers++;
        updateAndSave();
    }
    animateShopButton(buyHelperBtn);
});

function renderFactories() {
    const area = document.getElementById('factories-area');
    area.innerHTML = '';
    const perRow = 5;
    const rows = Math.ceil(factories / perRow);
    let factoryIndex = 0;
    for (let r = 0; r < rows; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'factory-row';
        for (let c = 0; c < perRow && factoryIndex < factories; c++, factoryIndex++) {
            const box = document.createElement('div');
            box.className = 'factory-box';
            box.textContent = '🏭';
            rowDiv.appendChild(box);
        }
        area.appendChild(rowDiv);
    }
}

function factoryEffect(idx) {
    const area = document.getElementById('factories-area');
    const perRow = 5;
    const rowIdx = Math.floor(idx / perRow);
    const colIdx = idx % perRow;
    const rowDiv = area.children[rowIdx];
    if (rowDiv) {
        const box = rowDiv.children[colIdx];
        if (box) {
            box.classList.add('effect');
            const eff = document.createElement('div');
            eff.className = 'factory-effect';
            box.appendChild(eff);
            // Lisätään +10-efekti
            const plus = document.createElement('div');
            plus.className = 'factory-plus';
            plus.textContent = '+10';
            box.appendChild(plus);
            setTimeout(() => {
                eff.remove();
                plus.remove();
            }, 800);
            setTimeout(() => {
                box.classList.remove('effect');
            }, 820);
        }
    }
}

buyFactoryBtn.addEventListener('click', () => {
    if (score >= 1000) {
        score -= 1000;
        factories++;
        updateAndSave();
        renderFactories();
    }
    animateShopButton(buyFactoryBtn);
});

// Avustajat naputtavat automaattisesti

function startHelperClicking() {
    if (!helpersActive) return;
    for (let i = 0; i < helpers; i++) {
        const randomDelay = 500 + Math.random() * 1500; // 0.5s - 2s
        setTimeout(() => {
            if (helpersActive) clickCookie();
        }, randomDelay);
    }
    setTimeout(startHelperClicking, 1000);
}

startHelperClicking();

let factoryInterval = setInterval(() => {
    let interval = 1000;
    if (superSpeedActive) interval = 500;
    if (factoriesActive && factories > 0) {
        score += factories * 10;
        scoreDiv.textContent = `Cookies: ${score}`;
        for (let i = 0; i < factories; i++) {
            factoryEffect(i);
        }
        saveGame();
    }
    if (factoriesActive && superfactories > 0) {
        score += superfactories * 100;
        scoreDiv.textContent = `Cookies: ${score}`;
        for (let i = 0; i < superfactories; i++) {
            superFactoryEffect(i);
        }
        saveGame();
    }
}, superSpeedActive ? 500 : 1000);

stopHelpersBtn.addEventListener('click', () => {
    helpersActive = false;
    factoriesActive = false;
});

startHelpersBtn.addEventListener('click', () => {
    if (!helpersActive) {
        helpersActive = true;
        startHelperClicking();
    }
    factoriesActive = true;
});

buySuperFactoryBtn.addEventListener('click', () => {
    if (score >= 100000) {
        score -= 100000;
        superfactories++;
        updateAndSave();
        renderSuperFactories();
    }
    animateShopButton(buySuperFactoryBtn);
});

function renderSuperFactories() {
    const area = document.getElementById('superfactories-area');
    area.innerHTML = '';
    const perRow = 5;
    const rows = Math.ceil(superfactories / perRow);
    let factoryIndex = 0;
    for (let r = 0; r < rows; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'superfactory-row';
        for (let c = 0; c < perRow && factoryIndex < superfactories; c++, factoryIndex++) {
            const box = document.createElement('div');
            box.className = 'superfactory-box';
            box.textContent = '🏢';
            rowDiv.appendChild(box);
        }
        area.appendChild(rowDiv);
    }
}

function superFactoryEffect(idx) {
    const area = document.getElementById('superfactories-area');
    const perRow = 5;
    const rowIdx = Math.floor(idx / perRow);
    const colIdx = idx % perRow;
    const rowDiv = area.children[rowIdx];
    if (rowDiv) {
        const box = rowDiv.children[colIdx];
        if (box) {
            box.classList.add('effect');
            const eff = document.createElement('div');
            eff.className = 'superfactory-effect';
            box.appendChild(eff);
            // Lisätään +100-efekti
            const plus = document.createElement('div');
            plus.className = 'superfactory-plus';
            plus.textContent = '+100';
            box.appendChild(plus);
            setTimeout(() => {
                eff.remove();
                plus.remove();
            }, 800);
            setTimeout(() => {
                box.classList.remove('effect');
            }, 820);
        }
    }
}

buySuperSpeedBtn.addEventListener('click', () => {
    if (score >= 120000 && !superSpeedActive) {
        score -= 120000;
        updateAndSave();
        superSpeedActive = true;
        superSpeedEndTime = Date.now() + 30000;
        superSpeedStatusDiv.textContent = 'Supernopeus aktiivinen! (30s)';
        buySuperSpeedBtn.disabled = true;
        buySuperSpeedBtn.textContent = 'Supernopeus käytössä';
        superSpeedTimeout = setTimeout(() => {
            superSpeedActive = false;
            superSpeedStatusDiv.textContent = '';
            buySuperSpeedBtn.disabled = false;
            buySuperSpeedBtn.textContent = 'Osta supernopeus (120000 keksiä)';
        }, 30000);
        updateSuperSpeedTimer();
    }
});

function updateSuperSpeedTimer() {
    if (superSpeedActive) {
        const left = Math.max(0, Math.floor((superSpeedEndTime - Date.now()) / 1000));
        superSpeedStatusDiv.textContent = `Supernopeus aktiivinen! (${left}s)`;
        if (left > 0) {
            setTimeout(updateSuperSpeedTimer, 500);
        }
    }
}

// Tallenna peli aina kun tapahtuu muutos
function updateAndSave() {
    scoreDiv.textContent = `Cookies: ${score}`;
    updateShopInfo();
    saveGame();
}

function saveGame() {
    sessionStorage.setItem('cookieClickerScore', score);
    sessionStorage.setItem('cookieClickerHelpers', helpers);
    sessionStorage.setItem('cookieClickerFactories', factories);
    sessionStorage.setItem('cookieClickerSuperFactories', superfactories);
}
function loadGame() {
    const savedScore = sessionStorage.getItem('cookieClickerScore');
    const savedHelpers = sessionStorage.getItem('cookieClickerHelpers');
    const savedFactories = sessionStorage.getItem('cookieClickerFactories');
    const savedSuperFactories = sessionStorage.getItem('cookieClickerSuperFactories');
    if (savedScore !== null) score = parseInt(savedScore);
    if (savedHelpers !== null) helpers = parseInt(savedHelpers);
    if (savedFactories !== null) factories = parseInt(savedFactories);
    if (savedSuperFactories !== null) superfactories = parseInt(savedSuperFactories);
    scoreDiv.textContent = `Cookies: ${score}`;
    updateShopInfo();
}
loadGame();
renderFactories();
renderSuperFactories();

openShopBtn.addEventListener('click', () => {
    shopModal.style.display = 'flex';
    updateShopInfo();
});
closeShopBtn.addEventListener('click', () => {
    shopModal.style.display = 'none';
});

function updateShopInfo() {
    helpersDiv.textContent = `Avustajia: ${helpers}`;
    factoriesDiv.textContent = `Tehtaita: ${factories}`;
    superfactoriesDiv.textContent = `Supertehtaita: ${superfactories}`;
    superSpeedStatusDiv.textContent = superSpeedActive ? `Supernopeus aktiivinen! (${Math.max(0, Math.floor((superSpeedEndTime - Date.now()) / 1000))}s)` : '';
    buySuperSpeedBtn.textContent = superSpeedActive ? 'Supernopeus käytössä' : 'Osta supernopeus (120000 keksiä)';
    buySuperSpeedBtn.disabled = !!superSpeedActive;
}
