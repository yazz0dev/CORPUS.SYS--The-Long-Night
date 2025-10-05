# SYSTEM_COLLAPSE.EXE v2: The Procedural Engine of Madness

**SYSTEM_COLLAPSE v2** is a procedurally generated labyrinth of digital decay - an infinite, branching web of corrupted realities where every page is born from a mathematical seed. No static content exists; each "room" is a transient hallucination, generated on-demand from pure algorithmic chaos.

This project embodies the hackathon's theme of broken systems at its most fundamental level: a website that doesn't actually exist as files, but as a deterministic nightmare born from numbers.

## The Seeded Abyss Concept

- **Infinite Worlds**: Every page is generated from a unique seed number
- **Deterministic Chaos**: The same seed always produces the same page (but you'll never visit the same place twice)
- **Branching Navigation**: Each choice combines with the current seed to create a new reality
- **Procedural Aesthetics**: Colors, layouts, animations, and even audio vary by seed
- **Memory Decay**: Stop moving for 2 seconds and watch your current reality disintegrate

## Core Innovation: The Procedural Generation Engine

**SYSTEM_COLLAPSE.EXE** broke the concept of a "website." Instead of static pages, we built:

1. **Seeded RNG**: Using mulberry32 for deterministic pseudo-randomness
2. **Content Pools**: Arrays of nouns, verbs, adjectives, and templates for text generation
3. **Dynamic Layouts**: Flexbox/grid arrangements chosen by seed
4. **Procedural Media**: Distorted images from picsum.photos and animated CSS shapes
5. **Audio Atmosphere**: Seed-controlled drone frequencies and occasional glitch sounds

Each page contains 2-6 elements: headings, paragraphs, navigation buttons, distorted images, decorative shapes, and ASCII art - all determined by the seed.

## Features

- **Procedural Page Generation**: Every page is uniquely generated from a seed
- **Seeded Navigation**: Choices create new seeds via `newSeed = currentSeed + choiceId + 1`
- **Procedural Aesthetics**: Colors, layouts, and collapse animations vary by seed
- **Enhanced Audio**: Seed-controlled ambient drones with occasional procedural glitches
- **Back Functionality**: History-based navigation through the seed tree
- **Mobile Support**: Touch events and responsive design

## Tech Stack

- **Runtime**: Bun (for speed and simplicity)
- **Backend**: ElysiaJS (serves static files)
- **Frontend**: ES6 Modules, Vanilla JavaScript, HTML, CSS
- **Generation**: Custom seeded RNG with mulberry32 algorithm
- **Audio**: Web Audio API with procedural sound generation

## Installation & Running

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Start the server:**

   ```bash
   bun run index.ts
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
├── public/
│   ├── index.html        # Minimal HTML shell
│   ├── style.css         # Procedural styling and animations
│   ├── script.js         # Main controller and state management
│   └── generator.js      # Procedural generation engine
├── src/
│   └── index.ts          # ElysiaJS server
├── package.json
└── README.md
```

## The Experience

1. **Genesis**: Start with a random seed that generates your first page
2. **Exploration**: Click choices to navigate through the infinite web
3. **Branching**: Each choice creates a unique path through mathematical space
4. **Survival**: Keep moving or watch reality collapse in unique ways
5. **Memory**: Use "GO BACK" to retrace your steps through the seed history

## Why This "Works"

**SYSTEM_COLLAPSE v2** succeeds because it genuinely breaks the web:

- **No Static Content**: Nothing is pre-written; everything is algorithmic
- **Infinite Novelty**: Every journey is unique yet deterministic
- **Mathematical Beauty**: The seed system creates a coherent web of chaos
- **Psychological Depth**: The collapse mechanic forces constant forward momentum
- **Technical Innovation**: Pure client-side procedural generation

It's not just broken - it's a new kind of web experience entirely.

## Awards This Project Targets

- **"WTF Build of the Year"** - A website that doesn't exist as files
- **"Broken But Beautiful"** - Mathematical chaos with aesthetic coherence
- **"The Fatal Error Award"** - When the system itself is the error

---

_"In the void of broken systems, we found infinity. Each seed a universe. Each choice, oblivion. Welcome to the labyrinth that writes itself."_
