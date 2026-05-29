/* ============================================================
   INTERVIEW PRACTICE TRACKER — app.js
   VITO · AI Software Engineer · Medical Software & Regulatory Innovation
   ============================================================ */

const STORAGE_KEY       = "ivtPracticeCards";
const FLASH_STORAGE_KEY = "ivtPracticeFlashState";
const DAILY_LIMIT       = 5;
const INTERVIEW_DATE    = new Date("2026-06-05T10:45:00");

const QA_BLOCK_REGEX = /(?:^|\n)(?:Q(?:uestion)?\s*[:.-]\s*)([\s\S]*?)(?:\nA(?:nswer)?\s*[:.-]\s*)([\s\S]*?)(?=(?:\nQ(?:uestion)?\s*[:.-])|$)/gi;

/* ---- VITO Sample Questions (from interview prep workspace) ---- */
const VITO_SAMPLE_QA = [
  {
    question: "Give your 90-second self-introduction.",
    answer: "My background is biomedical engineering. Most of my recent work is at the intersection where healthcare or research ideas need to become usable software. At Mindspeller, I worked as technical owner across several health-adjacent products—most relevantly an EEG-based neuroprofiling and AI reporting platform spanning data collection, preprocessing, feature extraction, AI-assisted interpretation, backend, frontend, deployment, validation, and documentation. VITO interests me because it sits exactly between the areas I want to build in: AI workflows, biomedical data, medical software, and real-world healthcare impact."
  },
  {
    question: "How did your three-agent neuroprofiling system work?",
    answer: "Three interpretation agents: (1) interpreted EEG-derived implicit report features, (2) interpreted semantic IAT path responses, (3) synthesized both into the final neuroprofile. AI worked as an interpretation layer on top of structured inputs—not as a free-form decision maker. This made the workflow easier to control, explain, and refine versus asking one model to generate a full profile from raw data."
  },
  {
    question: "Why multiple agents instead of one prompt?",
    answer: "EEG-derived data and semantic IAT responses are different types of input—combining them in one prompt makes the system harder to control and debug. Separating into agents gives each step a clearer responsibility. If output was weak, I could trace whether the issue came from EEG interpretation, IAT interpretation, or final synthesis. Easier iteration when refining recommendation logic in v2."
  },
  {
    question: "How did you validate AI-generated reports?",
    answer: "I treated validation as a workflow problem, not just output review. (1) Input quality: is required data available? Is session data usable? Do structured intermediate outputs make sense? (2) Output consistency: does the report stay faithful to EEG-derived features and IAT responses? Does it introduce unsupported claims? (3) Manual review and iteration—v1 showed open-ended role generation was too hard to explain, leading to curated role mapping in v2."
  },
  {
    question: "How did you reduce hallucination or uncontrolled output?",
    answer: "Reduced the model's decision space. In v2: cognitive features → role-relevant abilities → curated role list → AI selects and explains from that controlled structure. General approach: structured inputs + clear boundaries + predefined output formats + limited decision space. For sensitive workflows: human review + logging of intermediate outputs."
  },
  {
    question: "Why shift from LLM-generated roles to curated role mapping?",
    answer: "Open-ended role generation sounded convincing but was not explainable. If a model freely suggests a role, it is difficult to justify why. Curated mapping = extract cognitive features → map to role-relevant abilities → use a curated role list → AI selects top recommendations. Output becomes traceable and appropriate for a recruitment decision-support context. The shift was about explainability, control, and responsible use."
  },
  {
    question: "What makes an AI workflow explainable?",
    answer: "Explainability starts before the final output. The workflow should make clear: what inputs were used, what transformations happened, what rules or mappings were applied, what role the AI played. In the neuroprofiling product, explainability improved when role suggestions were tied back to a cognitive feature → ability → role mapping. In healthcare/medical software: document intended use, inputs, processing steps, model role, expected outputs, limitations, validation, and human oversight points."
  },
  {
    question: "How would you document this system for a medical software context?",
    answer: "Start with intended use—it determines risk level and documentation requirements. Then: user requirements, system requirements, data flow, model role, inputs/outputs, validation steps, known limitations, human review points. Separate what is deterministic from what is AI-assisted. Test cases for: normal inputs, missing data, poor-quality data, edge cases, repeated runs, unsafe/unsupported outputs. Document how changes to prompts, mappings, models, or data processing affect system behavior."
  },
  {
    question: "What would change if this system were used for clinical decision support?",
    answer: "Much stronger requirements: risk analysis, clinical evidence, validation, traceability, human oversight, data protection, change control. AI output would need clear limitations and should not silently make high-impact decisions. More careful evaluation: performance, dataset representativeness, failure modes, and how clinicians interact with output. The key distinction: self-insight/decision-support product vs. software that influences diagnosis, treatment, or clinical decision-making."
  },
  {
    question: "What is your understanding of SaMD / MDSW?",
    answer: "SaMD (Software as a Medical Device) / MDSW (Medical Device Software) is software with a medical intended purpose: diagnosis, prevention, monitoring, prediction, prognosis, treatment, or alleviation of disease. Key issue: intended use. The same technical system falls into different categories depending on claims made and how output is used. Intended use drives whether software becomes medical software and what regulatory expectations apply. I am regulatory-aware rather than a regulatory specialist, but I understand why intended use, risk, traceability, and validation are central."
  },
  {
    question: "How do you translate user requirements into system requirements?",
    answer: "Map the workflow: Who is the user? What data enters? What output is needed? What decisions are automated? What needs human review? What can fail? Then convert to system behavior: input validation, required data checks, processing steps, report generation logic, error handling, access control, output review. Many Mindspeller ideas started as broad product/research needs—my job was to turn them into data flows, backend logic, frontend workflows, validation steps, and documentation."
  },
  {
    question: "How would you test an AI healthcare prototype?",
    answer: "Multiple levels: (1) Non-AI parts: data ingestion, preprocessing, APIs, database, access control, frontend. (2) AI workflow: correct inputs received, output follows expected format, grounded in provided data, consistent across similar cases, handles missing/poor-quality inputs safely. (3) Safety and usability: does output overclaim? Are limitations clear? Is human review needed? Could output be misinterpreted? Key point: AI healthcare testing = technical correctness + output quality + safety + usability + traceability."
  },
  {
    question: "What is RAG, and where would it help in regulatory workflows?",
    answer: "RAG = retrieval-augmented generation. System retrieves relevant info from a document collection, then generates answers grounded in that context. Useful for: searching guidance documents, standards, internal procedures, technical documentation, previous evidence. BUT: generated answers should not be treated as final authority. Must show sources, support traceability, include human review. Retrieval quality is critical—wrong documents → convincing but wrong answers."
  },
  {
    question: "How do you handle sensitive health-related data?",
    answer: "Think from the start of the workflow: What data is truly necessary? Who needs access? Where is it stored? Is it sent to external services? How long is it retained? How are outputs controlled? Apply: data minimisation, role-based access, audit-friendly handling, separation between raw data/processed features/generated outputs. Be especially careful about sending sensitive data to external APIs—consider anonymisation, pseudonymisation, local processing, contractual safeguards, or human review before high-impact use."
  },
  {
    question: "What are your regulatory gaps and how are you addressing them?",
    answer: "Main gap: I have not owned a full medical software regulatory submission or certification process. Familiar with MDR and SaMD concepts, GDPR-aware workflows, documentation, validation logic, and audit-friendly handling—but not a regulatory specialist yet. What I want to build: the translation layer between regulation and engineering—how MDR/IVDR/AI Act/medical software guidance becomes development activities: user requirements, system requirements, risk controls, validation plans, technical documentation, traceability, and post-deployment monitoring."
  },
  {
    question: "Why are you applying while already employed?",
    answer: "My current role gave me unusual end-to-end ownership early: AI workflows, backend, frontend, biomedical data pipelines, deployment, documentation, GDPR-aware handling. But the work shifted toward B2B neuromarketing and consumer-tech. My long-term motivation is to build systems closer to healthcare, patients, validation, and real-world medical impact. VITO connects AI engineering, healthcare software, prototyping, documentation, regulatory-readiness, and real-world impact—which is the direction I want my career to move in."
  },
  {
    question: "Why VITO?",
    answer: "VITO's Digital BioSystems work combines AI, health data, digital twins, personalised medicine, and regulatory science—not as separate areas but as one integrated space. I want to contribute as a builder while growing into validated, documented, trusted healthcare AI. Not AI as a demo, but AI that can become useful, validated, and trusted in real healthcare settings."
  },
  {
    question: "Why should we choose you?",
    answer: "I connect several layers important for this role: biomedical systems understanding, hands-on software building across backend/frontend/APIs/data pipelines, practical AI workflow integration, and thinking in terms of validation, documentation, GDPR-aware handling, and user-facing reliability. Not the finished regulatory expert yet—but the right combination of builder mindset, biomedical context, AI workflow experience, and motivation to grow into regulatory-ready healthcare software."
  },
  {
    question: "How do you work when requirements are unclear?",
    answer: "Make ambiguity visible early. Translate the idea into a workflow: who is the user, what data enters, what output is expected, what decisions are automated, what needs review, what can fail. Build a small prototype or proof-of-concept to test assumptions. Once behavior is clearer, document the workflow and refine with stakeholders. At Mindspeller, many ideas started as broad product or research needs that had to become concrete data flows, backend logic, frontend workflows, and validation steps."
  }
];

/* ---- DOM Element Cache ---- */
const el = {
  fileInput:        document.getElementById("fileInput"),
  rawInput:         document.getElementById("rawInput"),
  importBtn:        document.getElementById("importBtn"),
  clearAllBtn:      document.getElementById("clearAllBtn"),
  importStatus:     document.getElementById("importStatus"),
  filterSelect:     document.getElementById("filterSelect"),
  cardList:         document.getElementById("cardList"),
  flashcardWrapper: document.getElementById("flashcardWrapper"),
  flashcard:        document.getElementById("flashcard"),
  flashQuestion:    document.getElementById("flashQuestion"),
  flashAnswer:      document.getElementById("flashAnswer"),
  showAnswerBtn:    document.getElementById("showAnswerBtn"),
  showAnswerLabel:  document.getElementById("showAnswerLabel"),
  nextFlashBtn:     document.getElementById("nextFlashBtn"),
  flashcardEmpty:   document.getElementById("flashcardEmpty"),
  flashcardDate:    document.getElementById("flashcardDate"),
  flashCounter:     document.getElementById("flashCounter"),
  loadVitoBtn:      document.getElementById("loadVitoBtn"),
  countdownValue:   document.getElementById("countdownValue"),
  statTotal:        document.getElementById("statTotal"),
  statUnread:       document.getElementById("statUnread"),
  statRevisit:      document.getElementById("statRevisit"),
  statCompleted:    document.getElementById("statCompleted"),
  progressBar:      document.getElementById("progressBar"),
  progressLabel:    document.getElementById("progressLabel"),
};

/* ---- State ---- */
let cards      = loadCards();
let flashState = loadFlashState();

/* ============================================================
   STORAGE
   ============================================================ */
function loadCards() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}
function loadFlashState() {
  try { return JSON.parse(localStorage.getItem(FLASH_STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveFlashState() {
  localStorage.setItem(FLASH_STORAGE_KEY, JSON.stringify(flashState));
}

/* ============================================================
   PARSING & NORMALIZATION
   ============================================================ */
function generateId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `card-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeCards(parsedCards) {
  return parsedCards
    .map((card) => ({
      id:       generateId(),
      question: (card.question || "").trim(),
      answer:   (card.answer   || "").trim(),
      status:   "unread"
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
        .map((item) => ({ question: item.question || item.q || "", answer: item.answer || item.a || "" }))
        .filter((item) => item.question && item.answer);
    }
  } catch { /* continue */ }

  const matches = [];
  let match = QA_BLOCK_REGEX.exec(trimmed);
  while (match !== null) {
    matches.push({ question: match[1].trim(), answer: match[2].trim() });
    match = QA_BLOCK_REGEX.exec(trimmed);
  }
  QA_BLOCK_REGEX.lastIndex = 0;
  if (matches.length > 0) return matches;

  return trimmed
    .split(/\n\s*\n+/)
    .map((block) => {
      const [firstLine, ...rest] = block.split("\n");
      return {
        question: (firstLine || "").replace(/^[-*]\s*/, "").trim(),
        answer:   rest.join("\n").trim()
      };
    })
    .filter((item) => item.question && item.answer);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ============================================================
   STATS & COUNTDOWN
   ============================================================ */
function renderStats() {
  const total     = cards.length;
  const completed = cards.filter((c) => c.status === "completed").length;
  const revisit   = cards.filter((c) => c.status === "revisit").length;
  const unread    = cards.filter((c) => c.status === "unread").length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  el.statTotal.textContent     = total;
  el.statCompleted.textContent = completed;
  el.statRevisit.textContent   = revisit;
  el.statUnread.textContent    = unread;
  el.progressBar.style.width   = `${pct}%`;
  el.progressLabel.textContent = `${pct}% done`;
}

function updateCountdown() {
  const now  = new Date();
  const diff = INTERVIEW_DATE - now;

  if (diff <= 0) {
    el.countdownValue.textContent = "Today!";
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    el.countdownValue.textContent = `${days}d ${hours}h`;
  } else if (hours > 0) {
    el.countdownValue.textContent = `${hours}h ${mins}m`;
  } else {
    el.countdownValue.textContent = `${mins}m`;
  }
}

/* ============================================================
   FLASHCARD
   ============================================================ */
function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function shuffle(values) {
  const copy = values.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function ensureDailyFlashcards() {
  const today = getTodayKey();
  if (flashState.date === today && Array.isArray(flashState.ids) && flashState.ids.length > 0) return;

  const priority = cards.filter((c) => c.status !== "completed");
  const source   = priority.length > 0 ? priority : cards;
  const ids      = shuffle(source.map((c) => c.id)).slice(0, DAILY_LIMIT);

  flashState = { date: today, ids, index: 0, flipped: false };
  saveFlashState();
}

function renderFlashcard() {
  ensureDailyFlashcards();

  if (!cards.length || !flashState.ids || flashState.ids.length === 0) {
    el.flashcardWrapper.classList.add("hidden");
    el.flashcardEmpty.classList.remove("hidden");
    el.flashcardDate.textContent = "";
    el.flashCounter.textContent  = "";
    return;
  }

  const total   = flashState.ids.length;
  const current = flashState.index % total;
  el.flashCounter.textContent = `${current + 1} / ${total}`;
  el.flashcardDate.textContent = `Session · ${flashState.date || getTodayKey()}`;

  const cardId = flashState.ids[current];
  const card   = cards.find((c) => c.id === cardId);

  if (!card) {
    flashState.index = 0;
    saveFlashState();
    renderFlashcard();
    return;
  }

  el.flashQuestion.textContent = card.question;
  el.flashAnswer.textContent   = card.answer;

  if (flashState.flipped) {
    el.flashcard.classList.add("flipped");
    el.showAnswerLabel.textContent = "Hide Answer";
  } else {
    el.flashcard.classList.remove("flipped");
    el.showAnswerLabel.textContent = "Show Answer";
  }

  el.flashcardWrapper.classList.remove("hidden");
  el.flashcardEmpty.classList.add("hidden");
}

/* ============================================================
   PRACTICE CARDS
   ============================================================ */
function renderCards() {
  const filter  = el.filterSelect.value;
  const visible = cards.filter((c) => filter === "all" || c.status === filter);

  el.cardList.innerHTML = "";

  if (visible.length === 0) {
    el.cardList.innerHTML = `<li class="empty-state"><span class="empty-icon">▶_</span>No cards for this filter.</li>`;
    return;
  }

  visible.forEach((card) => {
    const li = document.createElement("li");
    li.className = `card status-${card.status}`;
    li.innerHTML = `
      <p class="card-question"><span class="card-q-label">Q</span>${escapeHtml(card.question)}</p>
      <p class="card-answer"><span class="card-a-label">A</span>${escapeHtml(card.answer)}</p>
      <div class="card-footer">
        <span class="badge badge-${card.status}">${card.status}</span>
        <div class="card-actions">
          <button class="btn-card btn-card-done"    data-id="${card.id}" data-status="completed">✓ Done</button>
          <button class="btn-card btn-card-revisit" data-id="${card.id}" data-status="revisit">↩ Revisit</button>
          <button class="btn-card btn-card-reset"   data-id="${card.id}" data-status="unread">○ Unread</button>
        </div>
      </div>
    `;
    el.cardList.appendChild(li);
  });
}

/* ============================================================
   IMPORT
   ============================================================ */
function importCardsFromText(rawText) {
  const parsed     = parseCards(rawText);
  const normalized = normalizeCards(parsed);

  if (normalized.length === 0) {
    el.importStatus.textContent = "No valid cards found. Use Q:/A: pairs or JSON [{question,answer}].";
    el.importStatus.style.color = "var(--red)";
    return;
  }

  cards = cards.concat(normalized);
  saveCards();
  flashState = {};
  saveFlashState();

  el.importStatus.textContent = `✓ Imported ${normalized.cards} cards.`;
  el.importStatus.style.color = "var(--green)";
  el.importStatus.textContent = `✓ Imported ${normalized.length} card${normalized.length === 1 ? "" : "s"}.`;
  renderCards();
  renderFlashcard();
  renderStats();
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
el.importBtn.addEventListener("click", () => {
  importCardsFromText(el.rawInput.value);
  el.rawInput.value = "";
});

el.fileInput.addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const text = await file.text();
  importCardsFromText(text);
  el.fileInput.value = "";
});

el.clearAllBtn.addEventListener("click", () => {
  cards      = [];
  flashState = {};
  saveCards();
  saveFlashState();
  el.importStatus.textContent = "All cards cleared.";
  el.importStatus.style.color = "var(--text-muted)";
  renderCards();
  renderFlashcard();
  renderStats();
});

el.loadVitoBtn.addEventListener("click", () => {
  const existingQs = new Set(cards.map((c) => c.question.toLowerCase().trim()));
  const fresh = normalizeCards(
    VITO_SAMPLE_QA.filter((qa) => !existingQs.has(qa.question.toLowerCase().trim()))
  );

  if (fresh.length === 0) {
    el.importStatus.textContent = "VITO questions already loaded.";
    el.importStatus.style.color = "var(--text-muted)";
    return;
  }

  cards = cards.concat(fresh);
  saveCards();
  flashState = {};
  saveFlashState();
  el.importStatus.textContent = `⚡ Loaded ${fresh.length} VITO interview questions.`;
  el.importStatus.style.color = "var(--cyan)";
  renderCards();
  renderFlashcard();
  renderStats();
});

/* Flashcard flip */
function toggleFlip() {
  flashState.flipped = !flashState.flipped;
  saveFlashState();
  renderFlashcard();
}

el.showAnswerBtn.addEventListener("click", toggleFlip);
el.flashcard.addEventListener("click",     toggleFlip);

el.nextFlashBtn.addEventListener("click", () => {
  if (!flashState.ids || flashState.ids.length === 0) return;
  flashState.index  = (flashState.index + 1) % flashState.ids.length;
  flashState.flipped = false;
  saveFlashState();
  renderFlashcard();
});

el.filterSelect.addEventListener("change", renderCards);

/* Card status update */
el.cardList.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-id]");
  if (!btn) return;
  const target = cards.find((c) => c.id === btn.dataset.id);
  if (!target) return;
  target.status = btn.dataset.status;
  saveCards();
  renderCards();
  renderFlashcard();
  renderStats();
});

/* Keyboard shortcuts */
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

  if (e.code === "Space") {
    e.preventDefault();
    toggleFlip();
  } else if (e.code === "ArrowRight" || e.code === "KeyN") {
    el.nextFlashBtn.click();
  } else if (e.code === "Digit1") {
    markCurrentFlashcard("completed");
  } else if (e.code === "Digit2") {
    markCurrentFlashcard("revisit");
  }
});

function markCurrentFlashcard(status) {
  if (!flashState.ids || flashState.ids.length === 0) return;
  const id   = flashState.ids[flashState.index % flashState.ids.length];
  const card = cards.find((c) => c.id === id);
  if (!card) return;
  card.status = status;
  saveCards();
  renderCards();
  renderStats();
  /* Briefly show status feedback */
  el.importStatus.textContent = `Marked as ${status}.`;
  el.importStatus.style.color = status === "completed" ? "var(--green)" : "var(--amber)";
}

/* ============================================================
   INIT
   ============================================================ */
renderCards();
renderFlashcard();
renderStats();
updateCountdown();
setInterval(updateCountdown, 30_000);
