let gameData = {
    coins: parseInt(localStorage.getItem("puzzleBit_coins")) || 250,
    currentLevelIndex: parseInt(localStorage.getItem("puzzleBit_level")) || 0,
    levels: [],
    selectedLetters: "",
    foundWords: [],
    isMuted: localStorage.getItem("puzzleBit_muted") === "true",
    lastRewardTime: parseInt(localStorage.getItem("puzzleBit_lastReward")) || 0,
    music: new Audio("assets/music/gameplay.mp3")
};

async function init() {
    try {
        const response = await fetch('levels.json');
        if (!response.ok) throw new Error("Levels not found");
        const data = await response.json();
        gameData.levels = data.levels;
        
        updateCoinUI();
        setupEventListeners();
        applySettings();
        startLoadingSequence();
    } catch (e) {
        console.error("Critical Init Error:", e);
        // Fallback level if JSON fails
        gameData.levels = [{number:1, theme:"Forest", bg:"", letters:["A","T"], words:["AT"]}];
        startLoadingSequence();
    }
}

function updateCoinUI() {
    const el = document.getElementById("coinValue");
    if(el) el.innerText = gameData.coins;
    localStorage.setItem("puzzleBit_coins", gameData.coins);
}

function setupEventListeners() {
    // Buttons
    document.querySelector(".playBtn").onclick = () => showScreen("gameUI");
    document.getElementById("nextLevelBtn").onclick = nextLevel;
    document.getElementById("shuffleBtn").onclick = shuffleWheel;
    document.getElementById("hintBtn").onclick = useHint;
    document.getElementById("superHintBtn").onclick = useSuperHint;
    document.getElementById("dailyRewardBtn").onclick = getDailyReward;
    document.getElementById("settingsBtn").onclick = () => document.getElementById("settingsModal").style.display = "flex";
    document.getElementById("closeSettings").onclick = () => document.getElementById("settingsModal").style.display = "none";
    document.getElementById("soundToggle").onclick = toggleAudio;
    document.getElementById("resetDataBtn").onclick = resetProgress;
    
    // Desktop & Mobile Interaction
    window.addEventListener("mouseup", checkWord);
    window.addEventListener("touchend", checkWord);
}

function toggleAudio() {
    gameData.isMuted = !gameData.isMuted;
    localStorage.setItem("puzzleBit_muted", gameData.isMuted);
    applySettings();
}

function applySettings() {
    const btn = document.getElementById("soundToggle");
    if(btn) {
        btn.innerText = gameData.isMuted ? "OFF" : "ON";
        btn.style.background = gameData.isMuted ? "#ff7675" : "#6bd03f";
    }
    gameData.isMuted ? gameData.music.pause() : (gameData.music.paused && document.querySelector(".gameUI").style.display === "flex" ? gameData.music.play() : null);
}

function getDailyReward() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - gameData.lastRewardTime > oneDay) {
        gameData.coins += 100;
        gameData.lastRewardTime = now;
        localStorage.setItem("puzzleBit_lastReward", now);
        updateCoinUI();
        alert("💎 +100 Gems Claimed!");
    } else {
        alert("Check back later for more gems!");
    }
}

function startLoadingSequence() {
    setTimeout(() => {
        document.getElementById("loadingScreen").style.display = "none";
        document.querySelector(".languageScreen").style.display = "flex";
    }, 2000);
}

function showScreen(screenClass) {
    document.querySelector(".languageScreen").style.display = "none";
    document.querySelector(".gameUI").style.display = "flex";
    loadLevel();
    if(!gameData.isMuted) {
        gameData.music.loop = true;
        gameData.music.play().catch(() => {});
    }
}

function loadLevel() {
    if(gameData.currentLevelIndex >= gameData.levels.length) gameData.currentLevelIndex = 0;
    let level = gameData.levels[gameData.currentLevelIndex];
    document.getElementById("currentLevel").innerText = gameData.currentLevelIndex + 1;
    document.querySelector(".gameUI").style.backgroundImage = `url(${level.bg})`;
    localStorage.setItem("puzzleBit_level", gameData.currentLevelIndex);

    gameData.foundWords = [];
    gameData.selectedLetters = "";
    document.getElementById("puzzleGrid").innerHTML = "";
    
    level.words.forEach(word => {
        const row = document.createElement("div");
        row.className = "word-row";
        row.dataset.word = word;
        for(let char of word) {
            let box = document.createElement("div");
            box.className = "box";
            box.dataset.letter = char;
            row.appendChild(box);
        }
        document.getElementById("puzzleGrid").appendChild(row);
    });
    renderWheel(level.letters);
}

function renderWheel(letters) {
    const wheel = document.getElementById("letterWheel");
    wheel.innerHTML = "";
    letters.forEach((char, i) => {
        let span = document.createElement("span");
        span.className = "letter";
        span.innerText = char;
        let angle = i * (360 / letters.length);
        span.style.transform = `rotate(${angle}deg) translate(90px) rotate(-${angle}deg)`;
        
        const select = (e) => { e.preventDefault(); selectLetter(span, char); };
        span.onmousedown = select;
        span.ontouchstart = select;
        span.onmouseenter = (e) => { if(e.buttons === 1) selectLetter(span, char); };
        wheel.appendChild(span);
    });
}

function selectLetter(el, char) {
    if(el.classList.contains("selected")) return;
    el.classList.add("selected");
    gameData.selectedLetters += char;
    document.getElementById("currentWord").innerText = gameData.selectedLetters;
}

function checkWord() {
    if(!gameData.selectedLetters) return;
    const word = gameData.selectedLetters;
    const level = gameData.levels[gameData.currentLevelIndex];
    
    if(level.words.includes(word) && !gameData.foundWords.includes(word)) {
        gameData.foundWords.push(word);
        fillGrid(word);
        if(gameData.foundWords.length === level.words.length) setTimeout(showCompletePopup, 600);
    }
    
    gameData.selectedLetters = "";
    document.getElementById("currentWord").innerText = "";
    document.querySelectorAll(".letter").forEach(l => l.classList.remove("selected"));
}

function fillGrid(word) {
    document.querySelectorAll(".word-row").forEach(row => {
        if(row.dataset.word === word) {
            row.querySelectorAll(".box").forEach((box, i) => {
                box.innerText = word[i];
                box.classList.add("active");
            });
        }
    });
}

function showCompletePopup() {
    document.getElementById("levelComplete").style.display = "flex";
    gameData.coins += 50;
    updateCoinUI();
}

function nextLevel() {
    document.getElementById("levelComplete").style.display = "none";
    gameData.currentLevelIndex++;
    loadLevel();
}

function shuffleWheel() {
    let level = gameData.levels[gameData.currentLevelIndex];
    renderWheel([...level.letters].sort(() => Math.random() - 0.5));
}

function useHint() {
    if(gameData.coins >= 100) {
        const unrevealed = Array.from(document.querySelectorAll(".box:not(.active)"));
        if(unrevealed.length > 0) {
            gameData.coins -= 100;
            updateCoinUI();
            const target = unrevealed[Math.floor(Math.random() * unrevealed.length)];
            target.innerText = target.dataset.letter;
            target.classList.add("active");
            checkGridCompletion();
        }
    } else alert("Need more gems!");
}

function useSuperHint() {
    if(gameData.coins >= 300) {
        const hiddenRows = Array.from(document.querySelectorAll(".word-row")).filter(row => !Array.from(row.querySelectorAll(".box")).every(b => b.classList.contains("active")));
        if(hiddenRows.length > 0) {
            gameData.coins -= 300;
            updateCoinUI();
            const word = hiddenRows[0].dataset.word;
            gameData.foundWords.push(word);
            fillGrid(word);
            if(gameData.foundWords.length === gameData.levels[gameData.currentLevelIndex].words.length) setTimeout(showCompletePopup, 600);
        }
    } else alert("Need 300 gems!");
}

function checkGridCompletion() {
    document.querySelectorAll(".word-row").forEach(row => {
        const word = row.dataset.word;
        if(!gameData.foundWords.includes(word) && Array.from(row.querySelectorAll(".box")).every(b => b.classList.contains("active"))) {
            gameData.foundWords.push(word);
            if(gameData.foundWords.length === gameData.levels[gameData.currentLevelIndex].words.length) setTimeout(showCompletePopup, 600);
        }
    });
}

function resetProgress() {
    if(confirm("Reset all progress and gems?")) { localStorage.clear(); location.reload(); }
}

window.onload = init;
