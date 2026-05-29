# IVT-Practice

A minimal interview-practice web app to:
- import your Q&A canvas (paste text, upload `.txt/.md/.json`)
- track items as **Unread**, **Completed**, or **Revisit**
- get a fresh **daily flashcard set** to practice terminology and phrasing

## Run locally

Open `index.html` in a browser.

## Supported import formats

1. Q/A text blocks:

```text
Q: What is optimistic locking?
A: It prevents lost updates by checking a version before commit.

Q: Explain idempotency.
A: Repeating the same request yields the same effect.
```

2. JSON array:

```json
[
  { "question": "What is a mutex?", "answer": "A lock for mutual exclusion." },
  { "q": "What is SLA?", "a": "Service Level Agreement." }
]
```

Progress and flashcard state are saved in browser local storage.
