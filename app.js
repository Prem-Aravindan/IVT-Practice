/* ===== IVT Practice — Interview Prep Tracker ===== */

const STORAGE_KEY = "ivtPracticeCards";
const FLASH_STORAGE_KEY = "ivtPracticeFlashState";
const DAILY_FLASHCARD_LIMIT = 5;
const QA_BLOCK_REGEX = /(?:^|\n)(?:Q(?:uestion)?\s*[:.\-]\s*)([\s\S]*?)(?:\nA(?:nswer)?\s*[:.\-]\s*)([\s\S]*?)(?=(?:\nQ(?:uestion)?\s*[:.\-])|$)/gi;

const elements = {
  fileInput: document.getElementById("fileInput"),
  fileDrop: document.getElementById("fileDrop"),
  rawInput: document.getElementById("rawInput"),
  importBtn: document.getElementById("importBtn"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  importStatus: document.getElementById("importStatus"),
  toggleImport: document.getElementById("toggleImport"),
  filterSelect: document.getElementById("filterSelect"),
  cardList: document.getElementById("cardList"),
  flashcardDate: document.getElementById("flashcardDate"),
  flashcard: document.getElementById("flashcard"),
  flashQuestion: document.getElementById("flashQuestion"),
  flashAnswer: document.getElementById("flashAnswer"),
  flashProgress: document.getElementById("flashProgress"),
  showAnswerBtn: document.getElementById("showAnswerBtn"),
  nextFlashBtn: document.getElementById("nextFlashBtn"),
  flashcardEmpty: document.getElementById("flashcardEmpty"),
  totalCount: document.getElementById("totalCount"),
  unreadCount: document.getElementById("unreadCount"),
  completedCount: document.getElementById("completedCount"),
  revisitCount: document.getElementById("revisitCount"),
  statsBar: document.getElementById("statsBar")
};

let cards = loadCards();
let flashState = loadFlashState();

/* ===== STORAGE ===== */

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

/* ===== PARSING ===== */

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
    // Not JSON — continue with text parsing
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

/* ===== UTILITIES ===== */

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

/* ===== STATS ===== */

function renderStats() {
  const total = cards.length;
  const unread = cards.filter((c) => c.status === "unread").length;
  const completed = cards.filter((c) => c.status === "completed").length;
  const revisit = cards.filter((c) => c.status === "revisit").length;

  elements.totalCount.textContent = total;
  elements.unreadCount.textContent = unread;
  elements.completedCount.textContent = completed;
  elements.revisitCount.textContent = revisit;

  elements.statsBar.classList.toggle("hidden", total === 0);
}

/* ===== CARD RENDERING ===== */

function renderCards() {
  const filter = elements.filterSelect.value;
  const filteredCards = cards.filter((card) => filter === "all" || card.status === filter);

  elements.cardList.innerHTML = "";
  if (filteredCards.length === 0) {
    elements.cardList.innerHTML = `<li class="status">${cards.length === 0 ? "No cards yet. Import some content to get started!" : "No cards match this filter."}</li>`;
    return;
  }

  filteredCards.forEach((card) => {
    const item = document.createElement("li");
    item.className = "card";
    const badgeClass = `badge-${card.status}`;

    item.innerHTML = `
      <p class="card-question">Q: ${escapeHtml(card.question)}</p>
      <p class="card-answer">A: ${escapeHtml(card.answer)}</p>
      <div class="card-footer">
        <span class="badge ${badgeClass}">${card.status}</span>
        <div class="card-actions">
          <button class="btn-status${card.status === 'completed' ? ' active-completed' : ''}" data-id="${card.id}" data-status="completed">✅ Done</button>
          <button class="btn-status${card.status === 'revisit' ? ' active-revisit' : ''}" data-id="${card.id}" data-status="revisit">🔄 Revisit</button>
          <button class="btn-status" data-id="${card.id}" data-status="unread">🆕 Unread</button>
        </div>
      </div>
    `;
    elements.cardList.appendChild(item);
  });
}

/* ===== FLASHCARD ===== */

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
  elements.flashcardDate.textContent = flashState.date || getTodayKey();

  if (!flashState.ids || flashState.ids.length === 0) {
    elements.flashcard.classList.add("hidden");
    elements.flashcardEmpty.classList.remove("hidden");
    return;
  }

  const currentIndex = flashState.index % flashState.ids.length;
  const activeCardId = flashState.ids[currentIndex];
  const card = cards.find((item) => item.id === activeCardId);

  if (!card) {
    flashState.index = 0;
    saveFlashState();
    renderFlashcard();
    return;
  }

  elements.flashProgress.textContent = `Card ${currentIndex + 1} of ${flashState.ids.length}`;
  elements.flashQuestion.textContent = card.question;
  elements.flashAnswer.textContent = card.answer;
  elements.flashAnswer.classList.toggle("hidden", !flashState.answerVisible);
  elements.showAnswerBtn.textContent = flashState.answerVisible ? "🙈 Hide Answer" : "👁️ Reveal Answer";
  elements.flashcard.classList.remove("hidden");
  elements.flashcardEmpty.classList.add("hidden");
}

/* ===== IMPORT ===== */

function importCardsFromText(rawText) {
  const parsed = parseCards(rawText);
  const normalized = normalizeCards(parsed);

  if (normalized.length === 0) {
    elements.importStatus.textContent = "⚠️ No valid cards found. Use Q:/A: pairs, JSON [{question,answer}], or paragraph blocks.";
    return;
  }

  cards = cards.concat(normalized);
  saveCards();
  flashState = {};
  saveFlashState();
  elements.importStatus.textContent = `✅ Imported ${normalized.length} card${normalized.length > 1 ? "s" : ""}. Ready to practice!`;
  renderCards();
  renderFlashcard();
  renderStats();
}

/* ===== EVENT LISTENERS ===== */

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

// Drag and drop visual feedback
elements.fileDrop.addEventListener("dragover", (e) => {
  e.preventDefault();
  elements.fileDrop.classList.add("drag-over");
});

elements.fileDrop.addEventListener("dragleave", () => {
  elements.fileDrop.classList.remove("drag-over");
});

elements.fileDrop.addEventListener("drop", (e) => {
  e.preventDefault();
  elements.fileDrop.classList.remove("drag-over");
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (file) {
    file.text().then((text) => importCardsFromText(text));
  }
});

elements.clearAllBtn.addEventListener("click", () => {
  if (!confirm("Clear all cards? This cannot be undone.")) return;
  cards = [];
  flashState = {};
  saveCards();
  saveFlashState();
  elements.importStatus.textContent = "🗑️ All cards cleared.";
  renderCards();
  renderFlashcard();
  renderStats();
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
  renderStats();
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

// Toggle import panel collapse
elements.toggleImport.addEventListener("click", () => {
  const body = elements.toggleImport.closest(".panel").querySelector(".panel-body");
  const isHidden = body.classList.toggle("hidden");
  elements.toggleImport.textContent = isHidden ? "▶" : "▼";
});

/* ===== INIT ===== */
renderCards();
renderFlashcard();
renderStats();
