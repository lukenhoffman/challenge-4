// Variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = 60; // Assume the quiz time is 60 seconds
var timerId;

// Variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');

function startQuiz() {
  // Hide start screen
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');

  // Un-hide questions section
  questionsEl.removeAttribute('class');

  // Start timer
  timerId = setInterval(clockTick, 1000);

  // Show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;

  choicesEl.innerHTML = '';
  currentQuestion.choices.forEach(function(choice, i) {
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

    choicesEl.appendChild(choiceNode);
  });
}

function questionClick(event) {
  if (!event.target.matches('.choice')) return;

  var selectedChoice = event.target.value;
  var correctAnswer = questions[currentQuestionIndex].answer;

  // Check if user guessed wrong
  if (selectedChoice !== correctAnswer) {
      // Penalize time by 10 seconds, for instance
      time = Math.max(0, time - 10);
      feedbackEl.textContent = "Wrong!";
  } else {
      feedbackEl.textContent = "Correct!";
  }

  // Provide feedback for half a second, then clear
  feedbackEl.setAttribute('class', '');
  setTimeout(function () {
      feedbackEl.setAttribute('class', 'hide');
  }, 500);

  // Move to the next question
  currentQuestionIndex++;

  // Check if we’ve run out of questions
  if (currentQuestionIndex === questions.length) {
      quizEnd();
  } else {
      getQuestion();
  }
}


function quizEnd() {
  // Stop timer
  clearInterval(timerId);

  // Show end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  // Show final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;

  // Hide questions section
  questionsEl.setAttribute('class', 'hide');
}

function clockTick() {
  time--;
  timerEl.textContent = time;

  if (time <= 0) quizEnd();
}

function saveHighscore() {
  var initials = initialsEl.value.trim();

  if (initials !== "") {
    var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];
    var newScore = {
      score: time,
      initials: initials,
    };

    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // Redirect to next page
    window.location.href = 'highscores.html';
  }
}

function checkForEnter(event) {
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// User clicks button to submit initials
submitBtn.onclick = saveHighscore;

// User clicks button to start quiz
startBtn.onclick = startQuiz;

// User clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
