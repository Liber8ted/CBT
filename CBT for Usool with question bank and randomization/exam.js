const questionBank = [
    { question: "What is the capital of France?", options: ["Berlin", "London", "Paris", "Madrid"], correctAnswer: "Paris" },
    { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correctAnswer: "4" },
    { question: "What is the capital of Spain?", options: ["Madrid", "Lisbon", "Rome", "Paris"], correctAnswer: "Madrid" },
    { question: "What is 5 * 3?", options: ["15", "10", "20", "25"], correctAnswer: "15" },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correctAnswer: "Mars" },
    { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctAnswer: "Pacific" },
    { question: "What language is primarily spoken in Brazil?", options: ["Spanish", "English", "Portuguese", "French"], correctAnswer: "Portuguese" },
    { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Dickens", "Austen", "Hemingway"], correctAnswer: "Shakespeare" },
    { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], correctAnswer: "8" },
    { question: "Which element has the chemical symbol 'O'?", options: ["Oxygen", "Gold", "Iron", "Hydrogen"], correctAnswer: "Oxygen" },
    // Add more questions as needed
];

let score = 0;
let currentQuestionIndex = 0;
let selectedQuestions = [];
let examTimer;
let examDuration = 2 * 60 * 60; // 2 hours in seconds
let userName;
let answers = {}; // Object to store selected answers and whether the score was adjusted for each question

function getRandomQuestions(bank, numQuestions) {
    let shuffled = bank.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestions);
}

function loadQuestion() {
    if (currentQuestionIndex < selectedQuestions.length) {
        const currentQuestion = selectedQuestions[currentQuestionIndex];

        document.getElementById("questionText").textContent = currentQuestion.question;
        document.getElementById("label1").textContent = currentQuestion.options[0];
        document.getElementById("label2").textContent = currentQuestion.options[1];
        document.getElementById("label3").textContent = currentQuestion.options[2];
        document.getElementById("label4").textContent = currentQuestion.options[3];
        document.getElementById("option1").value = currentQuestion.options[0];
        document.getElementById("option2").value = currentQuestion.options[1];
        document.getElementById("option3").value = currentQuestion.options[2];
        document.getElementById("option4").value = currentQuestion.options[3];

        const radioButtons = document.querySelectorAll('input[name="answer"]');
        radioButtons.forEach(radio => radio.checked = false);

        if (answers[currentQuestionIndex] !== undefined) {
            radioButtons.forEach(radio => {
                if (radio.value === answers[currentQuestionIndex].selectedAnswer) {
                    radio.checked = true;
                }
            });
        }

        document.getElementById("prevButton").disabled = currentQuestionIndex === 0;
        document.getElementById("nextButton").style.display = currentQuestionIndex === selectedQuestions.length - 1 ? "none" : "inline-block";
        document.getElementById("submitButton").classList.toggle("hidden", currentQuestionIndex !== selectedQuestions.length - 1);
    } else {
        endExam();
    }
}

document.getElementById("nextButton").addEventListener("click", function () {
    submitAnswer();
    if (currentQuestionIndex < selectedQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
});

document.getElementById("prevButton").addEventListener("click", function () {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

function submitAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        const selectedAnswer = selectedOption.value;
        const correctAnswer = selectedQuestions[currentQuestionIndex].correctAnswer;
        const prevAnswer = answers[currentQuestionIndex]?.selectedAnswer;

        if (prevAnswer !== undefined) {
            if (prevAnswer === correctAnswer && selectedAnswer !== correctAnswer) {
                score--; // Correct answer changed to incorrect
            } else if (prevAnswer !== correctAnswer && selectedAnswer === correctAnswer) {
                score++; // Incorrect answer changed to correct
            }
        } else if (selectedAnswer === correctAnswer) {
            score++; // New correct answer selected
        }

        answers[currentQuestionIndex] = { selectedAnswer, correctAnswer };
        document.getElementById("feedback").textContent = selectedAnswer === correctAnswer ? "Correct!" : `Incorrect! The correct answer was: ${correctAnswer}`;
        document.getElementById("score").textContent = `Score: ${score}`;
    }
}

function startTimer() {
    examTimer = setInterval(function () {
        if (examDuration <= 0) {
            clearInterval(examTimer);
            endExam();
        } else {
            examDuration--;
            const hours = Math.floor(examDuration / 3600);
            const minutes = Math.floor((examDuration % 3600) / 60);
            const seconds = examDuration % 60;
            document.getElementById("timer").textContent = `Time Remaining: ${hours}:${minutes}:${seconds}`;
        }
    }, 1000);
}

document.getElementById("questionForm").addEventListener("submit", function (event) {
    event.preventDefault();
    submitAnswer();
    endExam();
});

function endExam() {
    clearInterval(examTimer);

    document.getElementById("examForm").style.display = "none";
    document.getElementById("summary").style.display = "block";

    const summaryList = document.getElementById("summaryList");
    summaryList.innerHTML = "";
    selectedQuestions.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.question} - Your answer: ${answers[index].selectedAnswer} - ${answers[index].selectedAnswer === answers[index].correctAnswer ? "Correct" : "Incorrect"}`;
        summaryList.appendChild(listItem);
    });

    const finalScoreElement = document.getElementById("finalScore");
    finalScoreElement.textContent = `Final Score: ${score} out of ${selectedQuestions.length}`;

    saveScore(userName, score);
    displayScoreHistory();
}

function saveScore(name, score) {
    let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory")) || [];
    scoreHistory.push({ name, score });
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));
}

function displayScoreHistory() {
    let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory")) || [];
    const scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = "";
    scoreHistory.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.textContent = `${entry.name}: ${entry.score}`;
        scoreList.appendChild(listItem);
    });

    const lastScore = scoreHistory[scoreHistory.length - 1];
    document.getElementById("lastScore").textContent = `Last Score: ${lastScore.name} - ${lastScore.score}`;
}

document.getElementById("startExamButton").addEventListener("click", function () {
    userName = document.getElementById("userName").value;
    if (userName) {
        selectedQuestions = getRandomQuestions(questionBank, 5);
        document.getElementById("examSection").style.display = "none";
        document.getElementById("examForm").style.display = "block";
        document.getElementById("summary").style.display = "block";

        loadQuestion();
        startTimer();
        saveScore(userName, score);
    displayScoreHistory();
    } else {
        alert("Please enter your name to start the exam.");
    }
});