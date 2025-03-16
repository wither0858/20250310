let question, options, submitButton, result, input;
let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let isAnswered = false;
let usedQuestions = new Set(); // 記錄已出現的題目

function preload() {
  // 載入 CSV 檔案
  questions = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 題目
  question = createP('');
  question.style('font-size', '24px');
  question.style('font-weight', 'bold');
  question.position(50, height / 2 - 120);

  // 選項（單選按鈕）
  options = createRadio();
  options.style('width', '800px'); // 設定選項寬度
  options.style('word-wrap', 'break-word'); // 讓選項文字換行
  options.position(50, height / 2 - 60);

  // 填空題輸入框
  input = createInput();
  input.style('font-size', '18px');
  input.style('padding', '5px');
  input.style('width', '300px');
  input.position(50, height / 2 - 60);
  input.hide(); // 預設隱藏

  // 送出按鈕
  submitButton = createButton('送出');
  submitButton.style('font-size', '18px');
  submitButton.position(50, height / 2);
  submitButton.mousePressed(handleButtonClick);

  // 結果顯示
  result = createP('');
  result.style('font-size', '20px');
  result.position(50, height / 2 + 60);

  loadNextQuestion();
}

function draw() {
  background("#b7efc5");

  // 顯示分數
  textSize(20);
  fill(0);
  text('答對題數: ' + correctCount, 10, 30);
  text('答錯題數: ' + incorrectCount, 10, 60);
  text('413730952 湯硯哲', 10, 90);
}

function loadNextQuestion() {
  if (usedQuestions.size >= questions.getRowCount()) {
    showResult();
    return;
  }

  let currentQuestion;
  do {
    currentQuestionIndex = floor(random(questions.getRowCount()));
    currentQuestion = questions.getRow(currentQuestionIndex);
  } while (usedQuestions.has(currentQuestionIndex) || isDuplicateQuestion(currentQuestion));

  usedQuestions.add(currentQuestionIndex);
  question.html(currentQuestion.get('question'));
  options.html(''); // 清空選項
  input.hide(); // 預設隱藏輸入框
  input.value(''); // 清空輸入框

  // 讀取選項，確保 undefined 或空字串不影響判斷
  let opt1 = currentQuestion.get('option1')?.trim() || '';
  let opt2 = currentQuestion.get('option2')?.trim() || '';
  let opt3 = currentQuestion.get('option3')?.trim() || '';
  let opt4 = currentQuestion.get('option4')?.trim() || '';

  if (opt1 === '' && opt2 === '' && opt3 === '' && opt4 === '') {
    input.show(); // 沒選項時顯示輸入框
    input.position(50, height / 2 - 60);
  } else {
    options.option(opt1);
    options.option(opt2);
    options.option(opt3);
    options.option(opt4);
  }

  submitButton.html('送出');
  result.html(''); // 清空結果文字
  isAnswered = false;
}

function handleButtonClick() {
  if (isAnswered) {
    loadNextQuestion();
  } else {
    checkAnswer();
  }
}

function checkAnswer() {
  let currentQuestion = questions.getRow(currentQuestionIndex);
  let answer = input.value().trim() || options.value();
  let correctAnswers = currentQuestion.get('answer').split('/').map(a => a.trim()); // 支援多個答案

  if (correctAnswers.includes(answer)) {
    correctCount++;
    result.html('答對了 🎉').style('color', 'green');
    submitButton.html('下一題');
  } else {
    incorrectCount++;
    result.html('答錯了 ❌').style('color', 'red');
  }
  isAnswered = true;
}

function showResult() {
  question.html('測驗結束');
  options.hide();
  input.hide();
  submitButton.hide();
  result.html(`✅ 答對題數: ${correctCount} <br> ❌ 答錯題數: ${incorrectCount}`);
}

function isDuplicateQuestion(newQuestion) {
  for (let index of usedQuestions) {
    let existingQuestion = questions.getRow(index);
    if (existingQuestion.get('question') === newQuestion.get('question')) {
      return true;
    }
  }
  return false;
}
