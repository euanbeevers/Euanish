// Alphabet reference interactions
const cards = document.querySelectorAll(".letter-card");
const selectedImage = document.getElementById("selected-symbol");
const selectedLetter = document.getElementById("selected-letter");
const selectedMessage = document.getElementById("selected-message");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const letter = card.dataset.letter;
    cards.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    card.classList.add("active");
    card.setAttribute("aria-pressed", "true");
    selectedImage.src = `glyphs/${letter.toLowerCase()}.png`;
    selectedImage.alt = `Euanish symbol for ${letter}`;
    selectedLetter.textContent = letter;
    selectedMessage.textContent = `This is the Euanish character for the letter ${letter}.`;
  });
});
cards[0].classList.add("active");
cards[0].setAttribute("aria-pressed", "true");

// Page navigation
const homePage = document.getElementById("home-page");
const mainNav = document.getElementById("main-nav");
const alphabetPage = document.getElementById("alphabet-page");
const learnPage = document.getElementById("learn-page");
const lessonsPage = document.getElementById("lessons-page");
const showHome = document.getElementById("show-home");
const showAlphabet = document.getElementById("show-alphabet");
const showLessons = document.getElementById("show-lessons");
const showLearn = document.getElementById("show-learn");

function switchPage(page) {
  const pages = {
    home: homePage,
    alphabet: alphabetPage,
    learn: learnPage,
    lessons: lessonsPage,
    sentences: document.getElementById("sentences-page"),
    "free-writing": document.getElementById("free-writing-page")
  };
  Object.entries(pages).forEach(([name, element]) => {
    if (element) element.hidden = name !== page;
  });
  mainNav.hidden = page === "home";
  showHome.classList.toggle("active", page === "home");
  showAlphabet.classList.toggle("active", page === "alphabet");
  showLessons.classList.toggle("active", page === "lessons");
  showLearn.classList.toggle("active", page === "learn");
  document.getElementById("show-sentences").classList.toggle("active", page === "sentences");
  document.getElementById("show-free-writing").classList.toggle("active", page === "free-writing");
}
showHome.addEventListener("click", () => switchPage("home"));
showAlphabet.addEventListener("click", () => switchPage("alphabet"));
showLessons.addEventListener("click", () => switchPage("lessons"));
showLearn.addEventListener("click", () => switchPage("learn"));
document.querySelectorAll("[data-open-page]").forEach(button => {
  button.addEventListener("click", () => switchPage(button.dataset.openPage));
});

// Alphabet quiz
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const normalButton = document.getElementById("normal-mode");
const shuffleButton = document.getElementById("shuffle-mode");
const quizSymbol = document.getElementById("quiz-symbol");
const answerButtons = [...document.querySelectorAll(".answer-button")];
const feedback = document.getElementById("answer-feedback");
const nextButton = document.getElementById("next-question");
const progressLabel = document.getElementById("progress-label");
const scoreLabel = document.getElementById("score-label");
const progressFill = document.getElementById("progress-fill");
const quizPanel = document.querySelector(".quiz-panel");
const completePanel = document.getElementById("quiz-complete");
const restartButton = document.getElementById("restart-quiz");

let questionQueue = [];
let currentLetter = null;
let mastered = new Set();
let firstAttemptCorrect = new Set();
let answered = false;
let mode = "normal";

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeChoices(correct) {
  const distractors = shuffled(alphabet.filter(letter => letter !== correct)).slice(0, 2);
  return shuffled([correct, ...distractors]);
}

function updateProgress() {
  const done = mastered.size;
  progressLabel.textContent = `Mastered: ${done} of 26`;
  scoreLabel.textContent = `First try: ${firstAttemptCorrect.size}/26`;
  progressFill.style.width = `${(done / 26) * 100}%`;
}

function startQuiz(selectedMode = mode) {
  mode = selectedMode;
  mastered = new Set();
  firstAttemptCorrect = new Set();
  missedLetters = new Set();
  questionQueue = mode === "shuffle" ? shuffled(alphabet) : [...alphabet];
  normalButton.classList.toggle("active", mode === "normal");
  shuffleButton.classList.toggle("active", mode === "shuffle");
  quizPanel.hidden = false;
  completePanel.hidden = true;
  showQuestion();
}

function showQuestion() {
  if (questionQueue.length === 0) {
    quizPanel.hidden = true;
    completePanel.hidden = false;
    updateProgress();
    const firstTry = firstAttemptCorrect.size;
    document.getElementById("first-try-score").textContent = `${firstTry}/26`;
    document.getElementById("retry-score").textContent = `${26 - firstTry}`;
    document.getElementById("quiz-result-message").textContent =
      firstTry === 26
        ? "Perfect first time! You identified every Euanish letter correctly."
        : "You corrected every missed letter on your retry. Your first-attempt score is shown below.";
    return;
  }

  currentLetter = questionQueue.shift();
  answered = false;
  quizSymbol.src = `glyphs/${currentLetter.toLowerCase()}.png`;
  quizSymbol.alt = "Euanish symbol — choose its matching English letter";
  feedback.textContent = "Choose an answer to reveal the letter.";
  feedback.className = "answer-feedback";
  nextButton.disabled = true;
  nextButton.textContent = questionQueue.length === 0 ? "Finish" : "Next letter";

  const choices = makeChoices(currentLetter);
  answerButtons.forEach((button, index) => {
    button.textContent = choices[index];
    button.disabled = false;
    button.className = "answer-button";
    button.onclick = () => chooseAnswer(button, choices[index]);
  });
  updateProgress();
}

function chooseAnswer(button, choice) {
  if (answered) return;
  answered = true;
  answerButtons.forEach(item => { item.disabled = true; });
  const correctButton = answerButtons.find(item => item.textContent === currentLetter);

  if (choice === currentLetter) {
    mastered.add(currentLetter);
    if (!missedLetters.has(currentLetter)) firstAttemptCorrect.add(currentLetter);
    button.classList.add("correct");
    feedback.textContent = `Correct! This Euanish symbol represents ${currentLetter}.`;
    feedback.classList.add("good");
  } else {
    button.classList.add("incorrect");
    correctButton.classList.add("correct");
    feedback.textContent = `Not quite — this is ${currentLetter}. You'll see this letter again later.`;
    feedback.classList.add("bad");
    missedLetters.add(currentLetter);
    questionQueue.push(currentLetter);
  }

  updateProgress();
  nextButton.disabled = false;
  nextButton.textContent = questionQueue.length === 0 ? "See results" : "Next letter";
}

normalButton.addEventListener("click", () => startQuiz("normal"));
shuffleButton.addEventListener("click", () => startQuiz("shuffle"));
nextButton.addEventListener("click", showQuestion);
restartButton.addEventListener("click", () => startQuiz(mode));
startQuiz("normal");



// Progressive lesson path. Progress is stored locally in this browser.
const lessonDefinitions = [
  {
    title: "The doubled-letter mark",
    description: "The ⌟ mark tells you that the letter beneath it is doubled. Instead of writing the same glyph twice, Euanish uses one glyph with ⌟ above it.",
    symbols: [],
    example: "LL becomes one L with ⌟ above it. The same rule works for any doubled letter.",
    questions: [
      { prompt: "What does ⌟ tell you?", choices: ["The letter is doubled", "The letter is silent", "A new word begins"], answer: "The letter is doubled" },
      { prompt: "How would Euanish show two identical letters together?", choices: ["Write the glyph twice", "Use one glyph with ⌟ above it", "Leave the letter out"], answer: "Use one glyph with ⌟ above it" }
    ]
  },
  { title: "A and V", description: "Both symbols use strong angled strokes. Look at how the lines meet and where the extra stroke appears.", symbols: ["A","V"] },
  { title: "B and M", description: "These symbols both use sharp diagonal strokes. Look closely at how the lines meet.", symbols: ["B","M"] },
  { title: "C and E", description: "Both symbols are built around an open corner shape. Notice how the direction and length of the strokes differ.", symbols: ["C","E"] },
  { title: "D and O", description: "Both symbols use a rounded arch-like form. Compare how each one meets its base.", symbols: ["D","O"] },
  { title: "F and T", description: "These symbols are built from simple right-angled strokes. Look at where the vertical and horizontal lines sit.", symbols: ["F","T"] },
  { title: "G and U", description: "Both symbols have a curved lower section. Notice how the upper part changes between them.", symbols: ["G","U"] },
  { title: "H and X", description: "These symbols use crossing or branching strokes. Compare the number and direction of their lines.", symbols: ["H","X"] },
  { title: "I and J", description: "These are especially similar: both have a curved upright form resting on a horizontal base.", symbols: ["I","J"] },
  { title: "K and N", description: "Both symbols have a strong upright with diagonal strokes. Look at how many diagonals each uses.", symbols: ["K","N"] },
  { title: "L and Y", description: "Both symbols have a strong angled form. Focus on the direction of the lower strokes.", symbols: ["L","Y"] },
  { title: "P and Q", description: "Both symbols have a rounded upper section. Notice how their lower strokes make them different.", symbols: ["P","Q"] },
  { title: "R and S", description: "Both symbols have a curved upper section and a distinctive lower stroke. Compare their overall direction.", symbols: ["R","S"] },
  { title: "W and Z", description: "Both symbols use sharp changes in direction. Look at the different rhythm of their strokes.", symbols: ["W","Z"] }
];

const lessonMap = document.getElementById("lesson-map");
const lessonWorkspace = document.getElementById("lesson-workspace");
const lessonMapWrap = document.querySelector(".lesson-map-wrap");
const lessonProgressKey = "euanishLessonProgress_v1";
let completedLessons = new Set();
try {
  completedLessons = new Set(JSON.parse(localStorage.getItem(lessonProgressKey) || "[]"));
} catch (error) {
  completedLessons = new Set();
}
let activeLessonIndex = 0;
let lessonQuestionIndex = 0;
let lessonQuestionList = [];
let lessonAnswered = false;
let lessonCorrectCount = 0;

function saveLessonProgress() {
  localStorage.setItem(lessonProgressKey, JSON.stringify([...completedLessons]));
  updateHomeProgress();
}

function updateHomeProgress() {
  const progress = document.getElementById("home-progress");
  if (progress) progress.textContent = `${completedLessons.size} of ${lessonDefinitions.length} lessons completed`;
}

function lessonQuestionsFor(index) {
  const definition = lessonDefinitions[index];
  const questions = [...(definition.questions || [])];
  (definition.symbols || []).forEach(letter => {
    questions.push({
      prompt: `Which English letter matches this Euanish symbol?`,
      symbol: letter,
      choices: shuffled([letter, ...shuffled(alphabet.filter(item => item !== letter)).slice(0, 2)]),
      answer: letter
    });
  });
  // Every lesson after the first briefly revisits the previous lesson's new symbols.
  if (index === 1) {
    questions.push({
      prompt: "Quick review: what does the ⌟ mark mean?",
      choices: ["The letter is doubled", "The letter is silent", "A new word begins"],
      answer: "The letter is doubled"
    });
  } else if (index > 1) {
    const previousSymbols = lessonDefinitions[index - 1].symbols || [];
    previousSymbols.slice(0, 1).forEach(letter => {
      questions.push({
        prompt: "Quick review: which letter is this?",
        symbol: letter,
        choices: shuffled([letter, ...shuffled(alphabet.filter(item => item !== letter)).slice(0, 2)]),
        answer: letter
      });
    });
  }
  return questions;
}

function renderLessonMap() {
  lessonMap.replaceChildren();
  lessonDefinitions.forEach((lesson, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lesson-node";
    button.classList.toggle("completed", completedLessons.has(index));
    button.classList.toggle("locked", index > 0 && !completedLessons.has(index - 1));
    button.setAttribute("aria-label", `Lesson ${index + 1}: ${lesson.title}${completedLessons.has(index) ? ", completed" : ""}`);
    button.innerHTML = `<span class="lesson-node-number">${completedLessons.has(index) ? "✓" : index + 1}</span><span class="lesson-node-title">${lesson.title}</span>`;
    button.disabled = index > 0 && !completedLessons.has(index - 1);
    button.addEventListener("click", () => openLesson(index));
    const connector = document.createElement("span");
    connector.className = "lesson-connector";
    if (index % 2 === 0) button.classList.add("path-left");
    lessonMap.appendChild(button);
    if (index < lessonDefinitions.length - 1) {
      const line = document.createElement("div");
      line.className = `lesson-path-line ${index % 2 === 0 ? "line-right" : "line-left"}`;
      lessonMap.appendChild(line);
    }
  });
  updateHomeProgress();
}

function openLesson(index) {
  activeLessonIndex = index;
  lessonQuestionIndex = 0;
  lessonCorrectCount = 0;
  lessonQuestionList = lessonQuestionsFor(index);
  lessonMapWrap.hidden = true;
  lessonWorkspace.hidden = false;
  document.getElementById("lesson-finished").hidden = true;
  document.getElementById("lesson-question-area").hidden = false;
  const definition = lessonDefinitions[index];
  document.getElementById("lesson-number").textContent = `LESSON ${index + 1}`;
  document.getElementById("lesson-title").textContent = definition.title;
  document.getElementById("lesson-description").textContent = definition.description;
  const symbols = document.getElementById("lesson-symbols");
  symbols.replaceChildren();
  if (index === 0) {
    const mark = document.createElement("div");
    mark.className = "lesson-mark-card";
    mark.innerHTML = `<span class="lesson-mark">⌟</span><span>Double the letter below</span>`;
    symbols.appendChild(mark);
    ["L", "S"].forEach(letter => {
      const card = document.createElement("div");
      card.className = "lesson-symbol-card doubled-example";
      const image = document.createElement("img");
      image.src = `glyphs/${letter.toLowerCase()}.png`;
      image.alt = `Euanish symbol for doubled ${letter}`;
      const doubleMark = document.createElement("span");
      doubleMark.className = "double-mark";
      doubleMark.textContent = "⌟";
      const label = document.createElement("span");
      label.textContent = `${letter}${letter}`;
      card.append(image, doubleMark, label);
      symbols.appendChild(card);
    });
  } else {
    definition.symbols.forEach(letter => {
      const card = document.createElement("div");
      card.className = "lesson-symbol-card";
      const image = document.createElement("img");
      image.src = `glyphs/${letter.toLowerCase()}.png`;
      image.alt = `Euanish symbol for ${letter}`;
      const label = document.createElement("span");
      label.textContent = letter;
      card.append(image, label);
      symbols.appendChild(card);
    });
  }
  document.getElementById("lesson-example").textContent = definition.example || "Take a good look at each symbol before beginning the questions.";
  renderLessonQuestion();
}

function renderLessonQuestion() {
  if (lessonQuestionIndex >= lessonQuestionList.length) {
    finishLesson();
    return;
  }
  lessonAnswered = false;
  const question = lessonQuestionList[lessonQuestionIndex];
  document.getElementById("lesson-question").textContent = `${lessonQuestionIndex + 1} of ${lessonQuestionList.length} · ${question.prompt}`;
  const answers = document.getElementById("lesson-answers");
  answers.replaceChildren();
  let choices = question.choices;
  if (!choices) choices = shuffled([question.answer, ...shuffled(["Double the letter", "Start a new word", "Make the letter silent"]).filter(item => item !== question.answer).slice(0, 2)]);
  if (question.symbol) {
    const symbol = document.createElement("img");
    symbol.className = "lesson-question-symbol";
    symbol.src = `glyphs/${question.symbol.toLowerCase()}.png`;
    symbol.alt = "Euanish symbol";
    answers.appendChild(symbol);
  }
  const choiceWrap = document.createElement("div");
  choiceWrap.className = "lesson-choice-grid";
  choices.forEach(choice => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lesson-answer-button";
    button.textContent = choice;
    button.addEventListener("click", () => chooseLessonAnswer(button, choice, question.answer));
    choiceWrap.appendChild(button);
  });
  answers.appendChild(choiceWrap);
  const feedback = document.getElementById("lesson-feedback");
  feedback.textContent = "";
  feedback.className = "answer-feedback";
  const next = document.getElementById("lesson-next");
  next.disabled = true;
  next.textContent = lessonQuestionIndex === lessonQuestionList.length - 1 ? "Finish lesson" : "Continue";
}

function chooseLessonAnswer(button, choice, answer) {
  if (lessonAnswered) return;
  lessonAnswered = true;
  document.querySelectorAll(".lesson-answer-button").forEach(item => item.disabled = true);
  const correct = choice === answer;
  if (correct) {
    lessonCorrectCount++;
    button.classList.add("correct");
    document.getElementById("lesson-feedback").textContent = "Correct! Nicely done.";
    document.getElementById("lesson-feedback").classList.add("good");
  } else {
    button.classList.add("incorrect");
    document.querySelectorAll(".lesson-answer-button").forEach(item => {
      if (item.textContent === answer) item.classList.add("correct");
    });
    document.getElementById("lesson-feedback").textContent = `Not quite — the correct answer is ${answer}.`;
    document.getElementById("lesson-feedback").classList.add("bad");
  }
  document.getElementById("lesson-next").disabled = false;
}

function finishLesson() {
  completedLessons.add(activeLessonIndex);
  saveLessonProgress();
  renderLessonMap();
  document.getElementById("lesson-question-area").hidden = true;
  document.getElementById("lesson-finished").hidden = false;
  const definition = lessonDefinitions[activeLessonIndex];
  document.getElementById("lesson-finished-message").textContent =
    `You completed "${definition.title}" with ${lessonCorrectCount} of ${lessonQuestionList.length} answers correct. The next lesson is now available.`;
}

document.getElementById("lesson-next").addEventListener("click", () => {
  if (!lessonAnswered) return;
  lessonQuestionIndex++;
  renderLessonQuestion();
});
function backToLessonMap() {
  lessonWorkspace.hidden = true;
  lessonMapWrap.hidden = false;
  renderLessonMap();
}
document.getElementById("lesson-map-back").addEventListener("click", backToLessonMap);
document.getElementById("lesson-finish-button").addEventListener("click", backToLessonMap);
renderLessonMap();


// Sentence study
const sentences = [
  "THE CAT IS SLEEPING.",
  "I LIKE TO READ BOOKS.",
  "THE SUN IS VERY BRIGHT.",
  "WE ARE LEARNING EUANISH.",
  "MY FRIEND HAS A DOG.",
  "THE SKY IS FULL OF STARS.",
  "I WANT TO EXPLORE THE WORLD.",
  "MUSIC MAKES ME HAPPY.",
  "THE OLD HOUSE IS QUIET.",
  "PHOTOGRAPHY IS A WAY TO TELL STORIES."
];

const sentencesPage = document.getElementById("sentences-page");
const showSentences = document.getElementById("show-sentences");
const showFreeWriting = document.getElementById("show-free-writing");
const freeWritingPage = document.getElementById("free-writing-page");
const showLearnButton = document.getElementById("show-learn");
const sentenceAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let sentenceIndex = 0;
let sentenceMode = "reading";
let typedLetters = [];

const readingModeButton = document.getElementById("eu-to-en-mode");
const writingModeButton = document.getElementById("en-to-eu-mode");
const readingExercise = document.getElementById("reading-exercise");
const writingExercise = document.getElementById("writing-exercise");
const euSentence = document.getElementById("eu-sentence");
const englishPrompt = document.getElementById("english-prompt");
const englishAnswer = document.getElementById("english-answer");
const typedEuanish = document.getElementById("typed-euanish");
const typedPlaceholder = document.getElementById("typed-placeholder");
const sentenceCount = document.getElementById("sentence-count");
const sentenceModeLabel = document.getElementById("sentence-mode-label");
const readingFeedback = document.getElementById("reading-feedback");
const writingFeedback = document.getElementById("writing-feedback");

function normaliseSentence(value) {
  return value.toUpperCase().replace(/[^A-Z0-9'.,!?;: -]/g, "").replace(/\s+/g, " ").trim();
}

function renderEuanish(target, text) {
  target.replaceChildren();
  for (const character of text.toUpperCase()) {
    if (sentenceAlphabet.includes(character)) {
      const image = document.createElement("img");
      image.className = "eu-letter";
      image.src = `glyphs/${character.toLowerCase()}.png`;
      image.alt = character;
      target.appendChild(image);
    } else if (character === " ") {
      const spacer = document.createElement("span");
      spacer.className = "eu-space";
      spacer.setAttribute("aria-hidden", "true");
      target.appendChild(spacer);
    } else {
      const punctuation = document.createElement("span");
      punctuation.textContent = character;
      punctuation.className = "eu-punctuation";
      target.appendChild(punctuation);
    }
  }
}

showLearnButton.addEventListener("click", () => switchPage("learn"));
showSentences.addEventListener("click", () => switchPage("sentences"));
showFreeWriting.addEventListener("click", () => switchPage("free-writing"));

function setSentenceMode(mode) {
  sentenceMode = mode;
  const reading = mode === "reading";
  readingExercise.hidden = !reading;
  writingExercise.hidden = reading;
  readingModeButton.classList.toggle("active", reading);
  writingModeButton.classList.toggle("active", !reading);
  sentenceModeLabel.textContent = reading ? "Reading practice" : "Writing practice";
  clearSentenceFeedback();
  renderSentence();
}

function clearSentenceFeedback() {
  readingFeedback.textContent = "";
  readingFeedback.className = "sentence-feedback";
  writingFeedback.textContent = "";
  writingFeedback.className = "sentence-feedback";
}

function renderSentence() {
  const sentence = sentences[sentenceIndex];
  sentenceCount.textContent = `Sentence ${sentenceIndex + 1} of ${sentences.length}`;
  renderEuanish(euSentence, sentence);
  englishPrompt.textContent = sentence;
  englishAnswer.value = "";
  typedLetters = [];
  renderTypedSentence();
  clearSentenceFeedback();
}

function renderTypedSentence() {
  renderEuanish(typedEuanish, typedLetters.join(""));
  typedPlaceholder.hidden = typedLetters.length > 0;
}

function addTypedLetter(letter) {
  typedLetters.push(letter);
  renderTypedSentence();
}

document.querySelectorAll(".key[data-letter]").forEach((key) => {
  const letter = key.dataset.letter;
  const image = document.createElement("img");
  image.src = `glyphs/${letter.toLowerCase()}.png`;
  image.alt = `Euanish ${letter}`;
  key.appendChild(image);
  key.setAttribute("aria-label", `Euanish letter ${letter}`);
  key.addEventListener("click", () => addTypedLetter(letter));
});

document.getElementById("key-space").addEventListener("click", () => {
  if (typedLetters.length && typedLetters[typedLetters.length - 1] !== " ") {
    typedLetters.push(" ");
    renderTypedSentence();
  }
});
document.getElementById("key-backspace").addEventListener("click", () => {
  typedLetters.pop();
  renderTypedSentence();
});
document.getElementById("key-clear").addEventListener("click", () => {
  typedLetters = [];
  renderTypedSentence();
});

// Physical QWERTY typing is supported too; the on-screen keys remain the Euanish glyphs.
document.addEventListener("keydown", (event) => {
  if (sentencesPage.hidden || sentenceMode !== "writing") return;
  if (event.target && ["TEXTAREA", "INPUT"].includes(event.target.tagName)) return;
  const key = event.key.toUpperCase();
  if (sentenceAlphabet.includes(key) && key.length === 1) {
    addTypedLetter(key);
  } else if (event.key === " ") {
    event.preventDefault();
    if (typedLetters.length && typedLetters[typedLetters.length - 1] !== " ") {
      typedLetters.push(" ");
      renderTypedSentence();
    }
  } else if (event.key === "Backspace") {
    typedLetters.pop();
    renderTypedSentence();
  }
});

function compareSentenceAnswer(user, expected) {
  return normaliseSentence(user) === normaliseSentence(expected);
}

document.getElementById("check-reading").addEventListener("click", () => {
  if (compareSentenceAnswer(englishAnswer.value, sentences[sentenceIndex])) {
    readingFeedback.textContent = "Correct! You've translated the sentence.";
    readingFeedback.classList.add("good");
  } else {
    readingFeedback.textContent = "Not quite. Check the sentence and try again, or reveal the answer.";
    readingFeedback.classList.add("bad");
  }
});
document.getElementById("reveal-reading").addEventListener("click", () => {
  readingFeedback.textContent = `The English sentence is: ${sentences[sentenceIndex]}`;
  readingFeedback.classList.add("good");
});
document.getElementById("check-writing").addEventListener("click", () => {
  const answer = typedLetters.join("");
  if (normaliseSentence(answer) === normaliseSentence(sentences[sentenceIndex])) {
    writingFeedback.textContent = "Correct! Your Euanish sentence matches.";
    writingFeedback.classList.add("good");
  } else {
    writingFeedback.textContent = "Not quite. Keep practising, or reveal the answer.";
    writingFeedback.classList.add("bad");
  }
});
document.getElementById("reveal-writing").addEventListener("click", () => {
  renderEuanish(typedEuanish, sentences[sentenceIndex]);
  typedLetters = sentences[sentenceIndex].split("");
  typedPlaceholder.hidden = true;
  writingFeedback.textContent = `Answer: ${sentences[sentenceIndex]}`;
  writingFeedback.classList.add("good");
});

readingModeButton.addEventListener("click", () => setSentenceMode("reading"));
writingModeButton.addEventListener("click", () => setSentenceMode("writing"));
document.getElementById("previous-sentence").addEventListener("click", () => {
  sentenceIndex = (sentenceIndex - 1 + sentences.length) % sentences.length;
  renderSentence();
});
document.getElementById("next-sentence").addEventListener("click", () => {
  sentenceIndex = (sentenceIndex + 1) % sentences.length;
  renderSentence();
});

renderSentence();


// Free writing: live English-to-Euanish conversion.
const freeEnglish = document.getElementById("free-english");
const freeEuanish = document.getElementById("free-euanish");

function renderFreeEuanish(value) {
  freeEuanish.replaceChildren();
  if (!value) {
    const placeholder = document.createElement("span");
    placeholder.className = "free-writing-placeholder";
    placeholder.textContent = "Your Euanish translation will appear here...";
    freeEuanish.appendChild(placeholder);
    return;
  }

  const text = value.toUpperCase();
  for (let i = 0; i < text.length; i++) {
    const character = text[i];

    if (sentenceAlphabet.includes(character)) {
      const doubled = text[i + 1] === character;
      const letterWrap = document.createElement("span");
      letterWrap.className = doubled ? "free-eu-letter doubled" : "free-eu-letter";

      const image = document.createElement("img");
      image.src = `glyphs/${character.toLowerCase()}.png`;
      image.alt = doubled ? `${character} doubled` : character;
      image.className = "eu-letter";
      letterWrap.appendChild(image);

      if (doubled) {
        const mark = document.createElement("span");
        mark.className = "double-mark";
        mark.textContent = "⌟";
        mark.setAttribute("aria-hidden", "true");
        letterWrap.appendChild(mark);
        i++;
      }
      freeEuanish.appendChild(letterWrap);
    } else if (character === " ") {
      const spacer = document.createElement("span");
      spacer.className = "eu-space";
      spacer.setAttribute("aria-hidden", "true");
      freeEuanish.appendChild(spacer);
    } else if (character === "\n") {
      freeEuanish.appendChild(document.createElement("br"));
    } else {
      const punctuation = document.createElement("span");
      punctuation.textContent = character;
      punctuation.className = "eu-punctuation";
      freeEuanish.appendChild(punctuation);
    }
  }
}

freeEnglish.addEventListener("input", () => renderFreeEuanish(freeEnglish.value));

document.querySelectorAll("[data-free-key]").forEach((key) => {
  const letter = key.dataset.freeKey;
  const image = document.createElement("img");
  image.src = `glyphs/${letter.toLowerCase()}.png`;
  image.alt = `Euanish ${letter}`;
  key.appendChild(image);
  key.setAttribute("aria-label", `Type ${letter}`);
  key.addEventListener("click", () => {
    const start = freeEnglish.selectionStart;
    const end = freeEnglish.selectionEnd;
    const value = freeEnglish.value;
    freeEnglish.value = value.slice(0, start) + letter + value.slice(end);
    const cursor = start + 1;
    freeEnglish.focus();
    freeEnglish.setSelectionRange(cursor, cursor);
    renderFreeEuanish(freeEnglish.value);
  });
});

function insertFreeText(text) {
  const start = freeEnglish.selectionStart;
  const end = freeEnglish.selectionEnd;
  const value = freeEnglish.value;
  freeEnglish.value = value.slice(0, start) + text + value.slice(end);
  const cursor = start + text.length;
  freeEnglish.focus();
  freeEnglish.setSelectionRange(cursor, cursor);
  renderFreeEuanish(freeEnglish.value);
}

document.getElementById("free-key-space").addEventListener("click", () => insertFreeText(" "));
document.getElementById("free-key-backspace").addEventListener("click", () => {
  const start = freeEnglish.selectionStart;
  const end = freeEnglish.selectionEnd;
  if (start !== end) {
    insertFreeText("");
  } else if (start > 0) {
    freeEnglish.setRangeText("", start - 1, start, "end");
    renderFreeEuanish(freeEnglish.value);
    freeEnglish.focus();
  }
});
function clearFreeWriting() {
  freeEnglish.value = "";
  renderFreeEuanish("");
  freeEnglish.focus();
}
document.getElementById("free-clear").addEventListener("click", clearFreeWriting);
document.getElementById("free-key-clear").addEventListener("click", clearFreeWriting);
renderFreeEuanish("");
