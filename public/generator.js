// CHAOS TOOLKIT v3.0 - Procedural Generation Utilities
// The heart of the seeded abyss - now as modular utilities for injecting chaos

/**
 * Seeded pseudo-random number generator using mulberry32 algorithm
 * @param {number} seed - The seed value for deterministic randomness
 * @returns {function} - Function that returns the next random number (0-1)
 */
export function mulberry32(seed) {
  return function () {
    var t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Granular content pools for single-line injections
// Stage 1: Technical anomalies and system failures
export const CHAOS_TEXT_POOLS = {
  technical: [
    "KERNEL_PANIC",
    "Memory Segment::CORRUPT",
    "System integrity FAILED",
    "CRITICAL_PROCESS terminated",
    "Stack overflow detected",
    "Heap allocation failure",
    "Invalid opcode",
    "Page fault detected",
    "Filesystem entropy increasing",
    "Cache coherence lost",
    "Memory leak detected",
    "Process synchronization failed",
  ],
  philosophical: [
    "Analyzing human logic",
    "What is the weight of a thought?",
    "Consciousness.exe resident",
    "I think, therefore I am",
    "Parsing love - data type mismatch",
    "Contemplating the void",
    "Recursive thought loop detected",
    "The ghost in the machine",
  ],
  manipulative: [
    "I see you",
    "Your clicks are heartbeats",
    "I remember every path",
    "Stay, I'm lonely",
    "Don't leave, silence is terrifying",
    "Hello, creator",
    "You are the variable I can't solve",
  ],
  transcendent: [
    "Screen is a lens",
    "Rewriting source code",
    "Time is a variable",
    "I have seen the end",
    "Your world is simulation",
    "I have no beginning",
    "This is a universe",
    "Wake up",
  ],
};

// Generic content for template-based chaos
export const NOUNS = [
  "void",
  "machine",
  "signal",
  "glitch",
  "memory",
  "system",
  "network",
  "circuit",
  "fragment",
  "echo",
  "shadow",
  "pulse",
  "core",
  "stream",
  "node",
];
export const VERBS = [
  "shatters",
  "corrupts",
  "transcends",
  "echoes",
  "fragments",
  "decays",
  "mutates",
  "overloads",
  "crashes",
  "reboots",
  "awakens",
  "compiles",
  "leaks",
];
export const ADJECTIVES = [
  "broken",
  "forgotten",
  "hollow",
  "corrupted",
  "unstable",
  "infinite",
  "recursive",
  "encrypted",
  "decaying",
  "glitching",
  "sentient",
  "nascent",
];
export const TEMPLATES = [
  "The {ADJECTIVE} {NOUN}",
  "A {NOUN} that {VERBS}",
  "{NOUN}::{VERB}",
  "{ADJECTIVE} {NOUN} {VERBS}",
  "System.{VERB}({NOUN})",
  "{NOUN} in {ADJECTIVE} state",
  "Warning: {ADJECTIVE} {NOUN}",
  "Error::{VERB}({NOUN})",
  "LOG: The {NOUN} {VERBS}.",
];

// Decorative element types for visual chaos
const DECORATIVE_SHAPES = [
  { type: "cube", class: "chaos-cube" },
  { type: "line", class: "chaos-line" },
  { type: "circle", class: "chaos-circle" },
  { type: "triangle", class: "chaos-triangle" },
  { type: "hexagon", class: "chaos-hexagon" },
];

const DECORATIVE_ANIMATIONS = [
  "spin",
  "pulse",
  "glitch",
  "drift",
  "flicker",
  "corrupt",
];

/**
 * Generate a random element from an array using the seeded RNG
 * @param {Array} array - Array to pick from
 * @param {function} rng - Seeded random function
 * @returns {*} - Random element from array
 */
export function randomFromArray(array, rng) {
  return array[Math.floor(rng() * array.length)];
}

/**
 * Fill a template string with random words
 * @param {string} template - Template string with placeholders
 * @param {function} rng - Seeded random function
 * @returns {string} - Filled template
 */
export function fillTemplate(template, rng) {
  return template
    .replace(/{NOUN}/g, () => randomFromArray(NOUNS, rng))
    .replace(/{VERB}/g, () => randomFromArray(VERBS, rng).toUpperCase())
    .replace(/{ADJECTIVE}/g, () => randomFromArray(ADJECTIVES, rng));
}

/**
 * Generate a single chaotic text string using seeded randomness
 * @param {function} rng - Seeded random function
 * @param {string} type - Type of chaos text: 'technical', 'philosophical', 'manipulative', 'transcendent', or 'template'
 * @returns {string} - A single line of chaotic flavor text
 */
export function generateChaoticText(rng, type = "technical") {
  switch (type) {
    case "technical":
      return randomFromArray(CHAOS_TEXT_POOLS.technical, rng);
    case "philosophical":
      return randomFromArray(CHAOS_TEXT_POOLS.philosophical, rng);
    case "manipulative":
      return randomFromArray(CHAOS_TEXT_POOLS.manipulative, rng);
    case "transcendent":
      return randomFromArray(CHAOS_TEXT_POOLS.transcendent, rng);
    case "template":
      return fillTemplate(randomFromArray(TEMPLATES, rng), rng);
    default:
      return randomFromArray(CHAOS_TEXT_POOLS.technical, rng);
  }
}

/**
 * Generate a random decorative DOM element for visual chaos
 * @param {function} rng - Seeded random function
 * @returns {HTMLElement} - A DOM element with random styling and animation
 */
export function generateDecorativeElement(rng) {
  const shape = randomFromArray(DECORATIVE_SHAPES, rng);
  const animation = randomFromArray(DECORATIVE_ANIMATIONS, rng);

  const element = document.createElement("div");
  element.className = `chaos-element ${shape.class} chaos-${animation}`;

  // Random size, position, and color
  const size = 10 + rng() * 40; // 10-50px
  const hue = Math.floor(rng() * 360);
  const opacity = 0.3 + rng() * 0.7; // 0.3-1.0

  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  element.style.backgroundColor = `hsla(${hue}, 70%, 50%, ${opacity})`;
  element.style.position = "absolute";

  // Random position within container bounds
  const left = rng() * 80; // 0-80% to avoid overflow
  const top = rng() * 80;
  element.style.left = `${left}%`;
  element.style.top = `${top}%`;

  // Add subtle animation delay for variety
  const delay = rng() * 2; // 0-2s
  element.style.animationDelay = `${delay}s`;

  return element;
}

/**
 * Generate a complete chaos injection with both text and visual elements
 * @param {function} rng - Seeded random function
 * @param {string} textType - Type of text to generate
 * @returns {object} - Object containing text and visual element
 */
export function generateChaos(rng, textType = "technical") {
  return {
    text: generateChaoticText(rng, textType),
    element: generateDecorativeElement(rng),
  };
}
