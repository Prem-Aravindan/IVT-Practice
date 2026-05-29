const STORAGE_KEY = "ivtPracticeCards";
const FLASH_STORAGE_KEY = "ivtPracticeFlashState";
const DAILY_FLASHCARD_LIMIT = 5;
const QA_BLOCK_REGEX = /(?:^|\n)(?:Q(?:uestion)?\s*[:.-]\s*)([\s\S]*?)(?:\nA(?:nswer)?\s*[:.-]\s*)([\s\S]*?)(?=(?:\nQ(?:uestion)?\s*[:.-])|$)/gi;

const elements = {
  fileInput: document.getElementById("fileInput"),
  rawInput: document.getElementById("rawInput"),
  importBtn: document.getElementById("importBtn"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  importStatus: document.getElementById("importStatus"),
  filterSelect: document.getElementById("filterSelect"),
  cardList: document.getElementById("cardList"),
  flashcardDate: document.getElementById("flashcardDate"),
  flashcard: document.getElementById("flashcard"),
  flashQuestion: document.getElementById("flashQuestion"),
  flashAnswer: document.getElementById("flashAnswer"),
  showAnswerBtn: document.getElementById("showAnswerBtn"),
  nextFlashBtn: document.getElementById("nextFlashBtn"),
  flashcardEmpty: document.getElementById("flashcardEmpty")
};

let cards = loadCards();
let flashState = loadFlashState();

function loadCards() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function loadFlashState() {
  try {
    return JSON.parse(localStorage.getItem(FLASH_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveFlashState() {
  localStorage.setItem(FLASH_STORAGE_KEY, JSON.stringify(flashState));
}

function normalizeCards(parsedCards) {
  return parsedCards
    .map((card) => ({
      id: generateId(),
      question: (card.question || "").trim(),
      answer: (card.answer || "").trim(),
      status: "unread"
    }))
    .filter((card) => card.question && card.answer);
}

function parseCards(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

  try {
    const json = JSON.parse(trimmed);
    if (Array.isArray(json)) {
      return json
        .map((item) => ({
          question: item.question || item.q || "",
          answer: item.answer || item.a || ""
        }))
        .filter((item) => item.question && item.answer);
    }
  } catch {
    // Ignore and continue with text parsing.
  }

  const matches = [];
  let match = QA_BLOCK_REGEX.exec(trimmed);
  while (match !== null) {
    matches.push({ question: match[1].trim(), answer: match[2].trim() });
    match = QA_BLOCK_REGEX.exec(trimmed);
  }
  QA_BLOCK_REGEX.lastIndex = 0;

  if (matches.length > 0) {
    return matches;
  }

  return trimmed
    .split(/\n\s*\n+/)
    .map((block) => {
      const [firstLine, ...rest] = block.split("\n");
      return {
        question: (firstLine || "").replace(/^[-*]\s*/, "").trim(),
        answer: rest.join("\n").trim()
      };
    })
    .filter((item) => item.question && item.answer);
}

function renderCards() {
  const filter = elements.filterSelect.value;
  const filteredCards = cards.filter((card) => filter === "all" || card.status === filter);

  elements.cardList.innerHTML = "";
  if (filteredCards.length === 0) {
    elements.cardList.innerHTML = "<li class='status'>No cards for this filter.</li>";
    return;
  }

  filteredCards.forEach((card) => {
    const item = document.createElement("li");
    item.className = "card";
    item.innerHTML = `
      <p><strong>Q:</strong> ${escapeHtml(card.question)}</p>
      <p><strong>A:</strong> ${escapeHtml(card.answer)}</p>
      <p><span class="badge">${card.status}</span></p>
      <div class="row wrap">
        <button data-id="${card.id}" data-status="completed">Completed</button>
        <button data-id="${card.id}" data-status="revisit" class="secondary">Revisit</button>
        <button data-id="${card.id}" data-status="unread" class="secondary">Mark unread</button>
      </div>
    `;
    elements.cardList.appendChild(item);
  });
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function generateId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `card-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function shuffle(values) {
  const copy = values.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function ensureDailyFlashcards() {
  const today = getTodayKey();
  if (flashState.date === today && Array.isArray(flashState.ids)) {
    return;
  }

  const priorityCards = cards.filter((card) => card.status !== "completed");
  const source = priorityCards.length > 0 ? priorityCards : cards;
  const shuffledIds = shuffle(source.map((c) => c.id)).slice(0, DAILY_FLASHCARD_LIMIT);

  flashState = {
    date: today,
    ids: shuffledIds,
    index: 0,
    answerVisible: false
  };
  saveFlashState();
}

function renderFlashcard() {
  ensureDailyFlashcards();
  elements.flashcardDate.textContent = `Daily set: ${flashState.date || getTodayKey()}`;

  if (!flashState.ids || flashState.ids.length === 0) {
    elements.flashcard.classList.add("hidden");
    elements.flashcardEmpty.classList.remove("hidden");
    return;
  }

  const activeCardId = flashState.ids[flashState.index % flashState.ids.length];
  const card = cards.find((item) => item.id === activeCardId);

  if (!card) {
    flashState.index = 0;
    saveFlashState();
    renderFlashcard();
    return;
  }

  elements.flashQuestion.textContent = `Q: ${card.question}`;
  elements.flashAnswer.textContent = `A: ${card.answer}`;
  elements.flashAnswer.classList.toggle("hidden", !flashState.answerVisible);
  elements.showAnswerBtn.textContent = flashState.answerVisible ? "Hide answer" : "Show answer";
  elements.flashcard.classList.remove("hidden");
  elements.flashcardEmpty.classList.add("hidden");
}

function importCardsFromText(rawText) {
  const parsed = parseCards(rawText);
  const normalized = normalizeCards(parsed);

  if (normalized.length === 0) {
    elements.importStatus.textContent = "No valid cards found. Use Q:/A: pairs or JSON [{question,answer}].";
    return;
  }

  cards = cards.concat(normalized);
  saveCards();
  flashState = {};
  saveFlashState();
  elements.importStatus.textContent = `Imported ${normalized.length} cards.`;
  renderCards();
  renderFlashcard();
}

elements.importBtn.addEventListener("click", () => {
  importCardsFromText(elements.rawInput.value);
  elements.rawInput.value = "";
});

elements.fileInput.addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const text = await file.text();
  importCardsFromText(text);
  elements.fileInput.value = "";
});

elements.clearAllBtn.addEventListener("click", () => {
  cards = [];
  flashState = {};
  saveCards();
  saveFlashState();
  elements.importStatus.textContent = "Cleared all cards.";
  renderCards();
  renderFlashcard();
});

elements.cardList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;

  const target = cards.find((card) => card.id === button.dataset.id);
  if (!target) return;

  target.status = button.dataset.status;
  saveCards();
  renderCards();
  renderFlashcard();
});

elements.filterSelect.addEventListener("change", renderCards);

elements.showAnswerBtn.addEventListener("click", () => {
  flashState.answerVisible = !flashState.answerVisible;
  saveFlashState();
  renderFlashcard();
});

elements.nextFlashBtn.addEventListener("click", () => {
  if (!flashState.ids || flashState.ids.length === 0) return;
  flashState.index = (flashState.index + 1) % flashState.ids.length;
  flashState.answerVisible = false;
  saveFlashState();
  renderFlashcard();
});

renderCards();
renderFlashcard();
