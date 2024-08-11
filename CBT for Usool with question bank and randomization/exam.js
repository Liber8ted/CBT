// Full Question Bank
const questionBank = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Rome"],
        correctAnswer: "Paris"
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Mars", "Venus"],
        correctAnswer: "Jupiter"
    },
    {
        question: "What language is primarily used for web development?",
        options: ["Python", "JavaScript", "C#", "Java"],
        correctAnswer: "JavaScript"
    },
    {
        question: "What is the fastest land animal?",
        options: ["Lion", "Cheetah", "Horse", "Eagle"],
        correctAnswer: "Cheetah"
    },
    {
        question: "What element does 'O' represent on the periodic table?",
        options: ["Oxygen", "Gold", "Iron", "Helium"],
        correctAnswer: "Oxygen"
    },
    // Add more questions as needed
    {
        question: "Which ocean is the largest?",
        options: ["Atlantic", "Pacific", "Indian", "Arctic"],
        correctAnswer: "Pacific"
    },
    {
        question: "What is the capital of Japan?",
        options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
        correctAnswer: "Tokyo"
    },
    {
        question: "What year did World War II end?",
        options: ["1945", "1918", "1939", "1963"],
        correctAnswer: "1945"
    },
    {
        question: "What is the boiling point of water?",
        options: ["90°C", "100°C", "110°C", "80°C"],
        correctAnswer: "100°C"
    },
    {
        question: "Who wrote 'Hamlet'?",
        options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
        correctAnswer: "William Shakespeare"
    }
];

// Function to randomly select questions from the question bank
function getRandomQuestions(questionBank, numQuestions) {
    const shuffledQuestions = questionBank.sort(() => 0.5 - Math.random());
    return shuffledQuestions.slice(0, numQuestions);
}

// Selected questions for the current exam
let selectedQuestions = [];
const numQuestionsInTest = 5; // Set how many questions you want in each test

// Initialize variables
let currentQuestionIndex = 0;
let score = 0;
const totalExamTime = 2 * 60 * 60; // 2 hours in seconds
let timeLeft = totalExamTime;
let timer;

// Display the first question
function loadQuestion() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    document.getElementById('questionText').textContent = currentQuestion.question;
    document.getElementById('label1').textContent = currentQuestion.options[0];
    document.getElementById('label2').textContent = currentQuestion.options[1];
    document.getElementById('label3').textContent = currentQuestion.options[2];
    document.getElementById('label4').textContent = currentQuestion.options[3];
    document.getElementById('option1').value = currentQuestion.options[0];
    document.getElementById('option2').value = currentQuestion.options[1];
    document.getElementById('option3').value = currentQuestion.options[2];
    document.getElementById('option4').value = currentQuestion.options[3];
}

// Display the last score and score history
function displayScores() {
    const userName = document.getElementById('userName').value;
    const lastScore = localStorage.getItem(`${userName}_lastScore`);
    const scoreHistory = JSON.parse(localStorage.getItem(`${userName}_scoreHistory`)) || [];

    if (lastScore !== null) {
        document.getElementById('lastScore').textContent = `Your last score was: ${lastScore} out of ${selectedQuestions.length}`;
    } else {
        document.getElementById('lastScore').textContent = "No previous score found.";
    }

    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = ''; // Clear the list before adding new items
    scoreHistory.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `Attempt ${index + 1}: ${entry.score} out of ${selectedQuestions.length} (Time: ${entry.timestamp})`;
        scoreList.appendChild(li);
    });
}

// Start the exam
document.getElementById('startExamButton').addEventListener('click', function() {
    const userName = document.getElementById('userName').value;

    if (userName.trim() === '') {
        alert('Please enter your name to start the exam.');
        return;
    }

    document.getElementById('startExamButton').disabled = true;
    document.getElementById('userName').disabled = true;
    document.getElementById('examForm').style.display = 'block';
    
    // Randomly select questions for this exam
    selectedQuestions = getRandomQuestions(questionBank, numQuestionsInTest);
    
    loadQuestion();
    startTimer();
    displayScores(); // Display last score and history
});

// Handle form submission
document.getElementById('examForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const userName = document.getElementById('userName').value;
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedOption) {
        document.getElementById('feedback').textContent = "Please select an answer.";
        return;
    }

    const chosenAnswer = selectedOption.value;
    const correctAnswer = selectedQuestions[currentQuestionIndex].correctAnswer;

    if (chosenAnswer === correctAnswer) {
        score++;
        document.getElementById('feedback').textContent = "Correct!";
        document.getElementById('feedback').style.color = "green";
    } else {
        document.getElementById('feedback').textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
        document.getElementById('feedback').style.color = "red";
    }

    document.getElementById('score').textContent = `Score: ${score}`;
    currentQuestionIndex++;

    if (currentQuestionIndex < selectedQuestions.length) {
        setTimeout(() => {
            document.getElementById('examForm').reset();
            document.getElementById('feedback').textContent = "";
            loadQuestion();
        }, 1000);
    } else {
        clearInterval(timer);
        document.getElementById('examForm').style.display = "none";
        const feedbackMessage = `Quiz complete! Your final score is ${score} out of ${selectedQuestions.length}.`;
        document.getElementById('feedback').textContent = feedbackMessage;
        document.getElementById('feedback').style.color = "blue";

        // Save the score in local storage
        localStorage.setItem(`${userName}_lastScore`, score);

        // Save the score to the score history
        const timestamp = new Date().toLocaleString();
        const scoreEntry = { score, timestamp };
        let scoreHistory = JSON.parse(localStorage.getItem(`${userName}_scoreHistory`)) || [];
        scoreHistory.push(scoreEntry);
        localStorage.setItem(`${userName}_scoreHistory`, JSON.stringify(scoreHistory));
        displayScores(); // Update score history
    }
});

// Timer function
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleExamTimeout(); // Handle exam timeout
        } else {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer').textContent = `Time left: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timeLeft--;
        }
    }, 1000);
}

function handleExamTimeout() {
    document.getElementById('feedback').textContent = "Time's up! The exam has ended.";
    document.getElementById('feedback').style.color = "red";

    // Disable form inputs
    document.getElementById('examForm').style.display = "none";
    const feedbackMessage = `Time's up! Your final score is ${score} out of ${selectedQuestions.length}.`;
    document.getElementById('feedback').textContent = feedbackMessage;
    document.getElementById('feedback').style.color = "blue";

    // Save the score in local storage
    const userName = document.getElementById('userName').value;
    localStorage.setItem(`${userName}_lastScore`, score);
}

    // Save the score to
