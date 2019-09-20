/**
 * Name: Bao Nguyen
 * Section: CSE 154 AC
 * Date: 5/1/2019
 * This Javacript file would add some functions to the trivia game like
 * generating questions, answers from the jservice.io database and
 * taking user input then response to it. Some of the animation
 * in this file is from anime.js. It allows the user to register and login to game
 */

/* global anime */

(function() {
  "use strict";

  const API_URL = "http://jservice.io/api/";
  let startTime = 61;
  let timerId = null;
  let answer = "";
  let userAnswer = "";
  let scoreGot = 0;
  let score = 0;
  let maxScore = 0;
  let answerStock = [];
  let userName = "";

  /** when a page loads a function would be called */
  window.addEventListener("load", init);

  /** make the button to do the action that they are assigned when clicked */
  function init() {
    id("start-btn").addEventListener("click", makeRequest);
    id("start-btn").addEventListener("click", switchView);
    id("start-btn").addEventListener("click", startTimer);
    id("skip-btn").addEventListener("click", getNew);
    id("quit-btn").addEventListener("click", exit);
    id("submit-btn").addEventListener("click", checkUserAnswer);
    id("auth").addEventListener("submit", registerUser);
    id("register").addEventListener("click",
      () => switchAuth("Join!", submitVerification, registerUser));
    id("login").addEventListener("click",
      () => switchAuth("Let's play!", registerUser, submitVerification));
  }

  /**
   * prepare game for the player to start
   * @param {String} responseData - data retrieved from the server
   */
  function prepareGame(responseData) {
    id("auth-view-wrapper").classList.add("hidden");
    id("intro").classList.remove("hidden");
    maxScore = parseInt(responseData);
    console.log(maxScore);
  }

  /** switch from introduction screen to game */
  function switchView() {
    displayScore();
    id("intro").classList.toggle("hidden");
    id("game").classList.toggle("hidden");
  }

  /** get new questions and answers */
  function getNew() {
    id("answer").innerHTML = "";
    stopGame();
    makeRequest();
  }

  /** quit the game */
  function exit() {
    score = 0;
    clearTimer();
    id("answer").innerHTML = "";
    switchView();
  }

  /** make a request to fetch the data from jservice.io */
  function makeRequest() {
    let url = API_URL + "random";
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(getData)
      .then(makeRequestCategory)
      .catch(() => displayError("The server is mad D: please try again later", "game"));
  }

  /**
   * get and extract data from jservice.io
   * @param {JSON} responseData - data retrieved from the website
   * @return {String} category id of the question
   */
  function getData(responseData) {
    scoreGot = responseData[0].value;
    let question = responseData[0].question;
    answer = responseData[0].answer;
    answerStock.push(answer);
    let id = responseData[0].category.id;
    displayQuestion(question);
    displayScore();
    return id;
  }

  /** start the timer */
  function startTimer() {
    timerId = setInterval(function() {
      if (startTime !== 0) {
        startTime--;
      } else {
        clearTimer();
        stopGame();
      }
      id("time").innerText = convertToMinutes(startTime);
    }, 1000);
  }

  /**
   * stop the game when go to new questions and answers or when the time runs out,
   * the user won't be able to click on skip and submit buttons when game is stopped
   */
  function stopGame() {
    id("submit-btn").disabled = true;
    id("skip-btn").disabled = true;
    let params = new FormData();
    params.append("username", userName);
    console.log(userName);
    params.append("maxscore", maxScore);
    console.log(maxScore);
    submitRequest("player-update.php", params);
  }

  /** resume the game when the new questions and answers are gotten */
  function resumeGame() {
    id("submit-btn").disabled = false;
    id("skip-btn").disabled = false;
  }

  /**
   * convert seconds to MM:SS format
   * @param {int} inputSec - the seconds that the user picked
   * @return {String} Time in MM:SS format
   */
  function convertToMinutes(inputSec) {
    let min = convertToTwoDigits(Math.floor(inputSec / 60));
    let sec = convertToTwoDigits(Math.floor(inputSec % 60));
    return min + ":" + sec;
  }

  /** clear the timer */
  function clearTimer() {
    clearInterval(timerId);
    timerId = null;
    startTime = 61;
  }

  /**
   * convert minute and second to two digits
   * @param {int} input - minute or second
   * @return {String} Converted minute or second
   */
  function convertToTwoDigits(input) {
    let timeString = "";
    if (input < 10) {
      timeString += "0" + input;
    } else {
      timeString += input;
    }
    return timeString;
  }

  /**
   * display question on the trivia page
   * @param {String} question - random question retrieved from the database
   */
  function displayQuestion(question) {
    let questionBox = id("question");
    let questionWithScore = question;
    questionBox.firstElementChild.innerText = questionWithScore;
  }

  /**
   * register user in the server
   * @param {event} e - event that was attached to the event listener
   */
  function registerUser(e) {
    e.preventDefault();
    userName = id("username").value;
    let formData = new FormData(id("auth"));
    submitRequest("player-insert.php", formData);
    switchAuth("Let's play!", registerUser, submitVerification);
  }

  /**
   * switch between register and log in option or vice versa
   * @param {String} btnName - name of the button
   * @param {function} func1 - prepare game or register the user
   * @param {function} func2 - prepare game or register the user
   */
  function switchAuth(btnName, func1, func2) {
    anime({
      targets: "#register-btn",
      translateX: 300,
      rotate: 720,
      borderRadius: ['0%', '50%'],
      direction: 'alternate',
      easing: 'easeInOutQuad',
      duration: 700,
      opacity: 0
    });
    id("auth").removeEventListener("submit", func1);
    id("auth").addEventListener("submit", func2);
    id("register-btn").innerText = btnName;
  }

  /**
   * send the user's input to the server for verification
   * @param {event} e - event attached to the event listener
   */
  function submitVerification(e) {
    e.preventDefault();
    userName = id("username").value;
    let submitUrl = "player-verify.php";
    let formData = new FormData(id("auth"));
    fetch(submitUrl, {
        method: "POST",
        body: formData
      })
      .then(checkStatus)
      .then(prepareGame)
      .catch(error => displayError(error, "auth-view-wrapper"));

  }

  /**
   * send the user's input to the server
   * @param {String} submitUrl - the customized url
   * @param {Object} formData - data that is sent to ther server
   */
  function submitRequest(submitUrl, formData) {
    fetch(submitUrl, {
        method: "POST",
        body: formData
      })
      .then(checkStatus)
      .catch(error => displayError(error, "auth-view-wrapper"));
  }

  /**
   * make request to fetch data of the category of the retrieved question from
   * jservice.io
   * @param {String} id - category id of the question
   */
  function makeRequestCategory(id) {
    let idQuery = "?id=" + id;
    let url = API_URL + "category/" + idQuery;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(getRandomAnswers)
      .catch(() => displayError("The server is mad D: please try again later", "game"));
  }

  /**
   * generate random answers from the same category
   * @param{JSON} responseData - data retrieved from the webstie
   */
  function getRandomAnswers(responseData) {
    let clueCount = parseInt(responseData.clues_count);
    let optionNumb = 0;
    if (clueCount < 4) {
      optionNumb = clueCount;
    } else {
      optionNumb = 3;
    }
    let ansIndex = 0;
    let randAnswer = "";
    for (let i = 0; i < optionNumb; i++) {
      do {
        ansIndex = Math.floor(Math.random() * clueCount);
        randAnswer = responseData["clues"][ansIndex]["answer"];
      } while (answerStock.includes(randAnswer));
      answerStock.push(randAnswer);
    }
    randomizeAnswers();
  }

  /** randomize the answers to put on display later */
  function randomizeAnswers() {
    let randArray = [];
    let randNumb = answerStock.length - 1;
    let maxRand = randNumb;
    let randIndex = 0;
    for (let i = 0; i < randNumb; i++) {
      randIndex = Math.floor(Math.random() * maxRand);
      randArray.push(answerStock[randIndex]);
      answerStock.splice(randIndex, 1);
      maxRand--;
    }
    randArray.push(answerStock[0]);
    answerStock = [];
    displayAnswers(randArray);
  }

  /**
   * dipslay answers for the user to pick
   * @param{array} randArray - array that contains random answers
   */
  function displayAnswers(randArray) {
    let ans = null;
    let label = null;
    let ansContainer = null;

    for (let i = 0; i < randArray.length; i++) {
      ans = document.createElement("input");
      label = document.createElement("label");
      ansContainer = document.createElement("div");
      ans.setAttribute("type", "radio");
      ans.name = "answer";
      ans.value = randArray[i];
      ans.addEventListener("change", getUserAnswer);
      label.for = ans.value;
      label.classList.add("answers");
      /*
        because Jservice implements html tags in their data so innerHTML would display
        the answers retrieved from the database better
      */
      label.innerHTML = ans.value;
      ansContainer.appendChild(ans);
      ansContainer.appendChild(label);
      id("answer").appendChild(ansContainer);
      resumeGame();
    }
  }

  /** get the user answer for the question */
  function getUserAnswer() {
    userAnswer = this.value;
  }

  /** check the user answer to see whether it's correct or not */
  function checkUserAnswer() {
    if (userAnswer === answer) {
      score += scoreGot;
      updateMaxScore();
    } else {
      displayCheck();
      setTimeout(() => toggleMsg("game"),
        1000);
    }
    getNew();
  }

  /** update the maxScore */
  function updateMaxScore() {
    maxScore = Math.max(score, maxScore);
    displayScore();
  }

  /** display the score and max score */
  function displayScore() {
    id("this-score").innerText = scoreGot;
    id("score").innerText = score;
    id("max-score").innerText = maxScore;
  }

  /**
   * display the error message
   * @param  {String} msg - customized error message or the one retrieved from the server
   * @param  {String} currentView - name of the view
   */
  function displayError(msg, currentView) {
    id("msg").innerText = msg;
    toggleMsg(currentView);
  }

  /** display the message when the user is wrong and show then the right one */
  function displayCheck() {
    id("msg").innerText = "Nice try but the correct answer is " + answer;
    toggleMsg("game");
  }

  /**
   * show or hide the game view and the message depend on their states
   * @param {String} currentView - the current view the player is on
   */
  function toggleMsg(currentView) {
    id(currentView).classList.toggle("hidden");
    id("check-msg").classList.toggle("hidden");
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    let responseText = response.text();
    if (response.status >= 200 && response.status < 300 || response.status === 0) {
      return responseText;
    } else {
      return responseText.then(Promise.reject.bind(Promise));
    }
  }
})();
