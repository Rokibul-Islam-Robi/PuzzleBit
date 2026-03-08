let gameData = {
    coins: parseInt(localStorage.getItem("puzzleBit_coins")) || 250,
    currentLevelIndex: parseInt(localStorage.getItem("puzzleBit_level")) || 0,
    levels: [],
    selectedLetters: "",
    foundWords: [],
    music: new Audio("assets/music/gameplay.mp3")
};

// Initialize Game
async function init() {
    try {
        const response = await fetch('levels.json');
        const data = await response.json();
        gameData.levels = data.levels;
        
        // Update UI with saved coins
        updateCoinUI();
        
        setupEventListeners();
        startLoadingSequence();
    } catch (e) {
        console.error("Failed to load levels", e);
    }
}

function updateCoinUI() {
    const el = document.getElementById("coinValue");
    if(el) {
        el.innerText = gameData.coins;
        // Simple animation effect
        el.style.transform = "scale(1.2)";
        setTimeout(() => el.style.transform = "scale(1)", 200);
    }
    localStorage.setItem("puzzleBit_coins", gameData.coins);
}

function setupEventListeners() {
    document.querySelector(".playBtn").onclick = () => {
        showScreen("gameUI");
    };
    
    document.getElementById("nextLevelBtn").onclick = nextLevel;
    document.getElementById("shuffleBtn").onclick = shuffleWheel;
    document.getElementById("hintBtn").onclick = useHint;
    
    // Global mouse up to clear word
    window.onmouseup = checkWord;
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
    
    // Start Music
    gameData.music.loop = true;
    gameData.music.play().catch(() => console.log("Music interaction required"));
}

function loadLevel() {
    // Reset index if out of bounds
    if(gameData.currentLevelIndex >= gameData.levels.length) {
        gameData.currentLevelIndex = 0;
    }

    let level = gameData.levels[gameData.currentLevelIndex];
    document.getElementById("currentLevel").innerText = gameData.currentLevelIndex + 1;
    document.querySelector(".gameUI").style.backgroundImage = `url(${level.bg})`;
    
    // Save progress
    localStorage.setItem("puzzleBit_level", gameData.currentLevelIndex);

    // Clear State
    gameData.foundWords = [];
    gameData.selectedLetters = "";
    
    // Render Grid
    const grid = document.getElementById("puzzleGrid");
    grid.innerHTML = "";
    
    // We create boxes for every word in the level
    level.words.forEach(word => {
        const wordRow = document.createElement("div");
        wordRow.className = "word-row";
        wordRow.style.display = "flex";
        wordRow.style.gap = "5px";
        wordRow.dataset.word = word;

        for(let i=0; i<word.length; i++) {
            let box = document.createElement("div");
            box.className = "box";
            box.dataset.letter = word[i];
            wordRow.appendChild(box);
        }
        grid.appendChild(wordRow);
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
        span.style.transform = `rotate(${angle}deg) translate(80px) rotate(-${angle}deg)`;
        
        span.onmousedown = (e) => {
            e.preventDefault();
            selectLetter(span, char);
        };
        span.onmouseenter = (e) => {
            if(e.buttons === 1) selectLetter(span, char);
        };
        
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
        
        if(gameData.foundWords.length === level.words.length) {
            setTimeout(showCompletePopup, 600);
        }
    }
    
    // Reset
    gameData.selectedLetters = "";
    document.getElementById("currentWord").innerText = "";
    document.querySelectorAll(".letter").forEach(l => {
        l.classList.remove("selected");
    });
}

function fillGrid(word) {
    const rows = document.querySelectorAll(".word-row");
    rows.forEach(row => {
        if(row.dataset.word === word) {
            const boxes = row.querySelectorAll(".box");
            boxes.forEach((box, i) => {
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
    let letters = [...level.letters];
    letters.sort(() => Math.random() - 0.5);
    renderWheel(letters);
}

function useHint() {
    if(gameData.coins >= 100) {
        const unrevealedBoxes = Array.from(document.querySelectorAll(".box:not(.active)"));
        if(unrevealedBoxes.length > 0) {
            gameData.coins -= 100;
            updateCoinUI();
            
            const randomBox = unrevealedBoxes[Math.floor(Math.random() * unrevealedBoxes.length)];
            randomBox.innerText = randomBox.dataset.letter;
            randomBox.classList.add("active");
            
            // Check if that hint completed a word
            const parentRow = randomBox.parentElement;
            const rowBoxes = parentRow.querySelectorAll(".box");
            const allActive = Array.from(rowBoxes).every(b => b.classList.contains("active"));
            
            if(allActive) {
                const word = parentRow.dataset.word;
                if(!gameData.foundWords.includes(word)) {
                    gameData.foundWords.push(word);
                    if(gameData.foundWords.length === gameData.levels[gameData.currentLevelIndex].words.length) {
                        setTimeout(showCompletePopup, 600);
                    }
                }
            }
        }
    } else {
        alert("Not enough coins for a hint!");
    }
}

window.onload = init;
