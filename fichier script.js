// Questions Database
const questions = {
    "histoire": {
        "easy": [
            {
                question: "En quelle année le Gabon a-t-il obtenu son indépendance ?",
                options: ["1958", "1960", "1962", "1965"],
                answer: 1,
                explanation: "Le Gabon a obtenu son indépendance de la France le 17 août 1960."
            },
            {
                question: "Qui était le premier président du Gabon ?",
                options: ["Omar Bongo", "Léon M'ba", "Jean-Hilaire Aubame", "Casimir Oyé-Mba"],
                answer: 1,
                explanation: "Léon M'ba fut le premier président du Gabon de 1960 à 1967."
            }
        ],
        "hard": [
            {
                question: "Quel traité historique a été signé en 1839 entre le roi Denis Rapontchombo et la France ?",
                options: ["Traité de Paris", "Traité de Ndjolé", "Traité du Cap Lopez", "Traité de la Mondah"],
                answer: 2,
                explanation: "Le traité du Cap Lopez marqua le début de l'influence française sur la côte gabonaise."
            },
            {
                question: "Quelle était la capitale du Gabon avant Libreville ?",
                options: ["Port-Gentil", "Lambaréné", "Franceville", "Le Gabon n'avait pas de capitale avant"],
                answer: 0,
                explanation: "Port-Gentil fut le principal centre administratif avant que Libreville ne soit fondée en 1849."
            }
        ]
    },
    "estuaire": {
        "easy": [
            {
                question: "Quel est le nom du plus grand marché de Libreville ?",
                options: ["Marché du Mont-Bouët", "Marché de Nkembo", "Marché de Lalala", "Marché de Glass"],
                answer: 0,
                explanation: "Le marché du Mont-Bouët est le plus grand et le plus ancien marché de Libreville."
            },
            {
                question: "Quelle commune de Libreville abrite le Palais présidentiel ?",
                options: ["Akanda", "Owendo", "Ntoum", "La Sablière"],
                answer: 3,
                explanation: "Le Palais présidentiel se trouve dans le quartier de La Sablière."
            }
        ],
        "hard": [
            {
                question: "Quel quartier historique de Libreville était autrefois un village de pêcheurs ?",
                options: ["Louis", "Glass", "Oloumi", "Nombakélé"],
                answer: 1,
                explanation: "Glass était à l'origine un village de pêcheurs avant de devenir un quartier de Libreville."
            },
            {
                question: "Quelle île de l'Estuaire abrite une réserve naturelle ?",
                options: ["Île Mandji", "Île Konike", "Île Pongara", "Île Mbanié"],
                answer: 2,
                explanation: "L'île Pongara abrite une réserve naturelle avec une importante biodiversité."
            }
        ]
    },
    "haut-ogooue": {
        "easy": [
            {
                question: "Quelle est la capitale de la province du Haut-Ogooué ?",
                options: ["Moanda", "Franceville", "Okondja", "Lastoursville"],
                answer: 1,
                explanation: "Franceville est le chef-lieu de la province du Haut-Ogooué."
            },
            {
                question: "Quelle compagnie minière exploite le manganèse à Moanda ?",
                options: ["Total Gabon", "COMILOG", "AREVA", "Perenco"],
                answer: 1,
                explanation: "La COMILOG (Compagnie Minière de l'Ogooué) exploite le manganèse depuis 1953."
            }
        ],
        "hard": [
            {
                question: "Quel est le nom du quartier historique de Franceville où se trouve la gare ?",
                options: ["Mvoumvou", "Masuku", "Mounana", "Lékédi"],
                answer: 0,
                explanation: "Le quartier Mvoumvou abrite la gare ferroviaire de Franceville."
            },
            {
                question: "Quel parc national se trouve partiellement dans le Haut-Ogooué ?",
                options: ["Parc de la Lopé", "Parc des Plateaux Batéké", "Parc d'Ivindo", "Parc de Waka"],
                answer: 1,
                explanation: "Le Parc national des Plateaux Batéké s'étend sur le Haut-Ogooué et la province voisine."
            }
        ]
    }
    // Ajouter les autres provinces ici...
};

// Variables du jeu
let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let currentCategory = "";
let currentDifficulty = "easy";
let username = "";

// Éléments DOM
const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const pointsElement = document.getElementById("points");
const timeElement = document.getElementById("time");
const difficultySelect = document.getElementById("difficulty");
const categoryBtns = document.querySelectorAll(".categories button");
const finalScoreElement = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const leaderboardList = document.getElementById("leaderboard-list");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// Événements
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
difficultySelect.addEventListener("change", (e) => {
    currentDifficulty = e.target.value;
    if (currentCategory) loadQuestion();
});

categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentCategory = btn.dataset.category;
        loadQuestion();
    });
});

// Fonctions
function startGame() {
    username = usernameInput.value.trim();
    if (!username) {
        alert("Veuillez entrer un nom d'utilisateur");
        return;
    }
    
    loginScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 60;
    timeElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function loadQuestion() {
    if (!currentCategory) return;
    
    const categoryQuestions = questions[currentCategory][currentDifficulty];
    if (!categoryQuestions || categoryQuestions.length === 0) {
        questionText.textContent = "Aucune question disponible pour cette catégorie";
        optionsContainer.innerHTML = "";
        return;
    }
    
    const question = categoryQuestions[currentQuestion % categoryQuestions.length];
    questionText.textContent = question.question;
    
    optionsContainer.innerHTML = "";
    question.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.addEventListener("click", () => checkAnswer(index, question.answer, question.explanation));
        optionsContainer.appendChild(btn);
    });
    
    currentQuestion++;
}

function checkAnswer(selectedIndex, correctIndex, explanation) {
    if (selectedIndex === correctIndex) {
        score += currentDifficulty === "easy" ? 10 : 20;
        pointsElement.textContent = score;
        correctSound.play();
        alert(`Correct! ${explanation}`);
    } else {
        wrongSound.play();
        alert(`Incorrect! ${explanation}`);
    }
    
    loadQuestion();
}

function endGame() {
    clearInterval(timer);
    gameScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    
    finalScoreElement.textContent = score;
    updateLeaderboard();
}

function updateLeaderboard() {
    // Enregistrer le score (dans localStorage pour cet exemple)
    let leaderboard = JSON.parse(localStorage.getItem("quizzGabomaLeaderboard")) || [];
    leaderboard.push({ username, score });
    
    // Trier par score décroissant
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Garder seulement les 10 meilleurs
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem("quizzGabomaLeaderboard", JSON.stringify(leaderboard));
    
    // Afficher le classement
    leaderboardList.innerHTML = "";
    leaderboard.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${entry.username} - ${entry.score} pts`;
        leaderboardList.appendChild(li);
    });
}

function restartGame() {
    currentQuestion = 0;
    score = 0;
    timeLeft = 60;
    currentCategory = "";
    
    pointsElement.textContent = "0";
    questionText.textContent = "Prêt à jouer ? Choisissez une catégorie !";
    optionsContainer.innerHTML = "";
    
    resultScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    
    startTimer();
}