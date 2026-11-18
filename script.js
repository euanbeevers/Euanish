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
const alphabetPage = document.getElementById("alphabet-page");
const learnPage = document.getElementById("learn-page");
const showAlphabet = document.getElementById("show-alphabet");
const showLearn = document.getElementById("show-learn");

function switchPage(page) {
  const learning = page === "learn";
  alphabetPage.hidden = learning;
  learnPage.hidden = !learning;
  showAlphabet.classList.toggle("active", !learning);
  showLearn.classList.toggle("active", learning);
}
showAlphabet.addEventListener("click", () => switchPage("alphabet"));
showLearn.addEventListener("click", () => switchPage("learn"));

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
  scoreLabel.textContent = `Remaining: ${26 - done}`;
  progressFill.style.width = `${(done / 26) * 100}%`;
}

function startQuiz(selectedMode = mode) {
  mode = selectedMode;
  mastered = new Set();
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
    button.classList.add("correct");
    feedback.textContent = `Correct! This Euanish symbol represents ${currentLetter}.`;
    feedback.classList.add("good");
  } else {
    button.classList.add("incorrect");
    correctButton.classList.add("correct");
    feedback.textContent = `Not quite — this is ${currentLetter}. You'll see this letter again later.`;
    feedback.classList.add("bad");
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

function switchPage(page) {
  const learning = page === "learn";
  const sentences = page === "sentences";
  const freeWriting = page === "free-writing";
  alphabetPage.hidden = learning || sentences || freeWriting;
  learnPage.hidden = !learning;
  sentencesPage.hidden = !sentences;
  freeWritingPage.hidden = !freeWriting;
  showAlphabet.classList.toggle("active", !learning && !sentences && !freeWriting);
  showLearn.classList.toggle("active", learning);
  showSentences.classList.toggle("active", sentences);
  showFreeWriting.classList.toggle("active", freeWriting);
}

showAlphabet.addEventListener("click", () => switchPage("alphabet"));
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
