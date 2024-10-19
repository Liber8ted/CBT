const questionBank = [
  {
    Image: "",
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    question: "What is the capital of Spain?",
    options: ["Madrid", "Lisbon", "Rome", "Paris"],
    correctAnswer: "Madrid",
  },
  {
    question: "What is 5 * 3?",
    options: ["15", "10", "20", "25"],
    correctAnswer: "15",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Chaucer", "Dickens", "Austen"],
    correctAnswer: "Shakespeare",
  },
  {
    question: "What is the square root of 64?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["O2", "CO2", "H2O", "HO"],
    correctAnswer: "H2O",
  },
  {
    question: "What year did World War II end?",
    options: ["1940", "1945", "1939", "1950"],
    correctAnswer: "1945",
  },
  {
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],
    correctAnswer: "Hydrogen",
  },
  {
    question: "Who was the first President of the United States?",
    options: [
      "Abraham Lincoln",
      "John Adams",
      "George Washington",
      "Thomas Jefferson",
    ],
    correctAnswer: "George Washington",
  },
  {
    question: "What is the speed of light?",
    options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000 km/s"],
    correctAnswer: "300,000 km/s",
  },
  {
    question: "Which language is primarily spoken in Brazil?",
    options: ["Spanish", "Portuguese", "French", "German"],
    correctAnswer: "Portuguese",
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
  },
  {
    question: "Which organ pumps blood through the body?",
    options: ["Brain", "Lungs", "Heart", "Kidneys"],
    correctAnswer: "Heart",
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Whale", "Shark", "Giraffe"],
    correctAnswer: "Whale",
  },
  {
    question: "Which planet is closest to the sun?",
    options: ["Earth", "Mercury", "Mars", "Venus"],
    correctAnswer: "Mercury",
  },
  {
    question: "How many degrees are in a circle?",
    options: ["360", "180", "90", "45"],
    correctAnswer: "360",
  },
  {
    question: "What is the longest river in the world?",
    options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
    correctAnswer: "Nile",
  },
  {
    question: "In which year did the Titanic sink?",
    options: ["1912", "1920", "1905", "1930"],
    correctAnswer: "1912",
  },
];

let score = 0;
let currentQuestionIndex = 0;
let selectedQuestions = [];
let examTimer;
let examDuration = 2 * 60 * 60; // 2 hours in seconds
let userName;
let answers = {}; // Store selected answers

function getRandomQuestions(bank, numQuestions) {
  let shuffled = bank.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numQuestions);
}

function loadQuestion() {
  if (currentQuestionIndex < selectedQuestions.length) {
    const currentQuestion = selectedQuestions[currentQuestionIndex];

    document.getElementById("questionText").textContent = `Q${
      currentQuestionIndex + 1
    }: ${currentQuestion.question}`;
    document.getElementById("label1").textContent = currentQuestion.options[0];
    document.getElementById("label2").textContent = currentQuestion.options[1];
    document.getElementById("label3").textContent = currentQuestion.options[2];
    document.getElementById("label4").textContent = currentQuestion.options[3];
    document.getElementById("option1").value = currentQuestion.options[0];
    document.getElementById("option2").value = currentQuestion.options[1];
    document.getElementById("option3").value = currentQuestion.options[2];
    document.getElementById("option4").value = currentQuestion.options[3];

    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach((radio) => (radio.checked = false));

    if (answers[currentQuestionIndex] !== undefined) {
      radioButtons.forEach((radio) => {
        if (radio.value === answers[currentQuestionIndex].selectedAnswer) {
          radio.checked = true;
        }
      });
    }

    document.getElementById("prevButton").disabled = currentQuestionIndex === 0;
    document.getElementById("nextButton").style.display =
      currentQuestionIndex === selectedQuestions.length - 1
        ? "none"
        : "inline-block";
    document
      .getElementById("submitButton")
      .classList.toggle(
        "hidden",
        currentQuestionIndex !== selectedQuestions.length - 1
      );

    createNavigationButtons();
  } else {
    endExam();
  }
}

// Function to create navigation buttons for each question
function createNavigationButtons() {
  const navigationButtonsDiv = document.getElementById("navigationButtons");
  navigationButtonsDiv.innerHTML = ""; // Clear existing buttons

  for (let i = 0; i < selectedQuestions.length; i++) {
    const button = document.createElement("button");
    button.textContent = `Q${i + 1}`;
    button.className = answers[i] ? "answered" : ""; // Change button color for answered questions
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent form submission behavior
      submitAnswer(); // Save the current answer before navigating
      currentQuestionIndex = i;
      loadQuestion();
    });
    navigationButtonsDiv.appendChild(button);
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
      } else if (
        prevAnswer !== correctAnswer &&
        selectedAnswer === correctAnswer
      ) {
        score++; // Incorrect answer changed to correct
      }
    } else if (selectedAnswer === correctAnswer) {
      score++; // New correct answer selected
    }

    answers[currentQuestionIndex] = { selectedAnswer, correctAnswer };
    document.getElementById("feedback").textContent =
      selectedAnswer === correctAnswer
        ? "Correct!"
        : `Incorrect! The correct answer was: ${correctAnswer}`;
    document.getElementById("score").textContent = `Score: ${score}`;
    createNavigationButtons(); // Update button colors after submitting answer
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
      document.getElementById(
        "timer"
      ).textContent = `Time Remaining: ${hours}:${minutes}:${seconds}`;
    }
  }, 1000);
}

document
  .getElementById("questionForm")
  .addEventListener("submit", function (event) {
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
    listItem.textContent = `${item.question} - Your answer: ${
      answers[index].selectedAnswer
    } - ${
      answers[index].selectedAnswer === answers[index].correctAnswer
        ? "Correct"
        : "Incorrect"
    }`;
    summaryList.appendChild(listItem);
  });

  const finalScoreElement = document.getElementById("finalScore");
  finalScoreElement.textContent = `Final Score: ${score} out of ${selectedQuestions.length}`;

  saveScore(userName, score);
  displayScoreHistory();
}

// Function to save user score with time and date
function saveScore(name, score) {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString();
  const timeString = currentDate.toLocaleTimeString();

  let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory")) || [];
  scoreHistory.push({ name, score, date: dateString, time: timeString });
  localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));
}

// Function to display user score history with time and date
function displayScoreHistory() {
  let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory")) || [];
  const scoreList = document.getElementById("scoreList");
  scoreList.innerHTML = "";

  const currentUserScores = scoreHistory.filter(
    (entry) => entry.name === userName
  );

  currentUserScores.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}: ${entry.score} - Date: ${entry.date} - Time: ${entry.time}`;
    scoreList.appendChild(listItem);
  });

  if (currentUserScores.length > 0) {
    const lastScore = currentUserScores[currentUserScores.length - 1];
    document.getElementById(
      "lastScore"
    ).textContent = `Last Score: ${lastScore.name} - ${lastScore.score} - Date: ${lastScore.date} - Time: ${lastScore.time}`;
  }
}

document
  .getElementById("startExamButton")
  .addEventListener("click", function () {
    userName = document.getElementById("userName").value;
    if (userName) {
      selectedQuestions = getRandomQuestions(questionBank, 5);
      document.getElementById("examSection").style.display = "none";
      document.getElementById("examForm").style.display = "block";
      document.getElementById("summary").style.display = "none";
      document.getElementById("body").style.backgroundColor = "#030269";
      document.getElementById("logoSide").style.display = "none";
      document.getElementById("footer1").style.display = "none";

      loadQuestion();
      startTimer();
    } else {
      alert("Please enter your name to start the exam.");
    }
  });

// Function to clear score history for the current user after password confirmation
function clearUserScoreHistoryWithPassword(name) {
  const password = prompt("Enter your password to clear score history:");

  // Replace 'yourPassword' with the actual password you want to use
  if (password === "admin123") {
    let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory")) || [];
    scoreHistory = scoreHistory.filter((entry) => entry.name !== name);
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));

    alert("Score history cleared successfully!");
    document.getElementById("scoreList").innerHTML = ""; // Clear displayed score history on the page
  } else {
    alert("Incorrect password. Score history not cleared.");
  }
}

// Function to display score history of all users
function displayAllUsersScoreHistory() {
  let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory")) || [];
  const scoreList = document.getElementById("scoreList");
  scoreList.innerHTML = "";

  if (scoreHistory.length === 0) {
    scoreList.innerHTML = "<li>No scores found.</li>";
  } else {
    scoreHistory.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${entry.name}: ${entry.score} - Date: ${entry.date} - Time: ${entry.time}`;
      scoreList.appendChild(listItem);
    });
  }
}
// Function to retry the test
function refreshPage() {
  const password2 = prompt("Enter your password to retry the test:");
  if (password === "admin123") {
    location.reload();
  } else {
    alert("Incorrect password. Contact your supervisor");
  }
}
