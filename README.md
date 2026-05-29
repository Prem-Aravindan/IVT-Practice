# IVT Practice — Interview Prep Tracker

A retro-modern dark-mode web app to help you practice interview questions, track progress, and reinforce key terminology with daily flashcards.

## Features

- **Import Q&A Content** — Paste or upload interview prep material in multiple formats (Q:/A: blocks, JSON arrays, or paragraph-separated text)
- **Practice Cards** — Track each card's status: unread, completed, or revisit
- **Daily Flashcards** — Get a randomized set of 5 cards each day prioritizing unreviewed material
- **Progress Stats** — See at-a-glance counts of your total, unread, completed, and revisit cards
- **Dark Mode Retro UI** — CRT scanline effects, neon glow accents, pixel headers, and modern layout

## Usage

Open `index.html` in any modern browser. No server required.

### Supported Import Formats

1. **Q/A Text Blocks**
   ```
   Q: What is your biggest strength?
   A: I am highly adaptable and thrive in ambiguous situations.
   ```

2. **JSON Array**
   ```json
   [{"question": "Tell me about yourself", "answer": "I am a software engineer..."}]
   ```

3. **Paragraph Blocks** (first line = question, rest = answer, separated by blank lines)

## Tech Stack

- Pure HTML, CSS, JavaScript — no build tools or dependencies
- Data persists in browser `localStorage`
- Google Fonts: Press Start 2P (headings) + Space Mono (body)