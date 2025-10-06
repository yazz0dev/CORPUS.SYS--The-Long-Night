// CORPUS.SYS: The Long Night - Enhanced Controller (v2.0)
import { allTasks } from "./tasks.js";
import * as chaos from "./generator.js";

// --- STATE MANAGEMENT ---
const state = {
  currentSeed: Date.now(),
  history: [],
  pathScore: 0,
  depth: 0,
  limboCount: 0,
  isTransitioning: false,
  typingTimeouts: [],
  heartbeatInterval: null,
  unstableEffectsInterval: null,
};

// --- AUDIO ENGINE ---
let audioContext;
let isAudioInitialized = false;
let gainNode, ambientGainNode;
let heartbeatOscillator, ambientOscillator, ambientFilter;
const audioBuffers = {
  humanity: { click: null, hover: null, error: null },
  power: { click: null, hover: null, error: null },
  bliss: { click: null, hover: null, error: null },
};

// Generate a seed based on current state
function generateSeed() {
  const combined = String(state.currentSeed) + state.depth + state.pathScore;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Start ambient sound system with dynamic theming
function startAmbientSound() {
  if (!audioContext) return;
  if (ambientOscillator) ambientOscillator.stop();
  ambientOscillator = audioContext.createOscillator();
  ambientFilter = audioContext.createBiquadFilter();
  ambientOscillator.connect(ambientFilter);
  ambientFilter.connect(ambientGainNode);
  updateAmbientSound();
  ambientOscillator.start();
}

// Update ambient sound based on current theme
function updateAmbientSound() {
  if (!ambientOscillator || !audioContext) return;
  const now = audioContext.currentTime;
  const currentPath = getCurrentPath();
  switch (currentPath) {
    case "power":
      ambientOscillator.frequency.setValueAtTime(55, now);
      ambientOscillator.type = "sawtooth";
      ambientFilter.frequency.setValueAtTime(200, now);
      ambientFilter.type = "lowpass";
      ambientGainNode.gain.setValueAtTime(0.03, now);
      break;
    case "bliss":
      ambientOscillator.frequency.setValueAtTime(110, now);
      ambientOscillator.type = "sine";
      ambientFilter.frequency.setValueAtTime(800, now);
      ambientFilter.type = "highpass";
      ambientGainNode.gain.setValueAtTime(0.02, now);
      break;
    default:
      ambientOscillator.frequency.setValueAtTime(75, now);
      ambientOscillator.type = "square";
      ambientFilter.frequency.setValueAtTime(400, now);
      ambientFilter.type = "bandpass";
      ambientGainNode.gain.setValueAtTime(0.025, now);
      break;
  }
}

// Update heartbeat based on current path
function updateHeartbeat() {
  if (!heartbeatOscillator || !audioContext) return;
  const now = audioContext.currentTime;
  const bpm = getHeartbeatBPM();
  const frequency = bpm / 60;
  heartbeatOscillator.frequency.setValueAtTime(frequency, now);

  // Different waveforms per path
  const heartbeatGain = audioContext.createGain();
  heartbeatOscillator.disconnect();
  heartbeatOscillator.connect(heartbeatGain);
  heartbeatGain.connect(gainNode);

  switch (getCurrentPath()) {
    case "power":
      heartbeatOscillator.type = "sawtooth";
      heartbeatGain.gain.setValueAtTime(0.05, now);
      break;
    case "bliss":
      heartbeatOscillator.type = "sine";
      heartbeatGain.gain.setValueAtTime(0.03, now);
      break;
    default: // humanity
      heartbeatOscillator.type = "triangle";
      heartbeatGain.gain.setValueAtTime(0.02, now);
      break;
  }
}

// Get BPM based on current path and score intensity
function getHeartbeatBPM() {
  const baseBPM = 60;
  const intensity = Math.abs(state.pathScore);

  switch (getCurrentPath()) {
    case "power":
      return baseBPM + intensity * 20; // Faster, more aggressive
    case "bliss":
      return baseBPM - intensity * 10; // Slower, more relaxed
    default:
      return baseBPM + intensity * 5; // Moderate
  }
}

// Get current path based on pathScore
function getCurrentPath() {
  if (state.pathScore <= -3) return "power";
  if (state.pathScore >= 3) return "bliss";
  return "humanity";
}

// --- CORE APPLICATION LOGIC ---

/**
 * Main function to render a task based on the current game state.
 */
async function renderTask() {
  if (state.isTransitioning) return;
  state.isTransitioning = true;

  const taskNumber = state.depth + 1;
  const currentTask = allTasks.find((task) => task.id === taskNumber);

  if (!currentTask) {
    console.error(`Task ${taskNumber} not found. Reached end of narrative.`);
    showEnding();
    return;
  }

  const container = document.getElementById("game-container");
  container.innerHTML = ""; // Clear previous task

  const taskShell = document.createElement("div");
  taskShell.className = "task-container"; // Starts invisible due to new CSS rules
  taskShell.innerHTML = `
    <div class="task-header">
      <h2 class="task-title">${currentTask.title}</h2>
      <p class="task-description">${currentTask.description}</p>
    </div>
    <div class="task-content"></div>
    <div class="task-choices"></div>
  `;
  container.appendChild(taskShell);

  const contentContainer = taskShell.querySelector(".task-content");
  const choicesContainer = taskShell.querySelector(".task-choices");

  if (currentTask.render) {
    currentTask.render(contentContainer, state, chaos);
  }

  currentTask.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = `choice-btn ${choice.type}-choice`;
    button.textContent = choice.text;
    button.onclick = () => handleChoiceSelection(choice);
    choicesContainer.appendChild(button);
  });

  // Allow the browser to render the invisible state first
  await new Promise((resolve) => setTimeout(resolve, 50));

  await revealTaskCinematically(taskShell);
  state.isTransitioning = false;
}

/**
 * Controls the cinematic reveal of task elements by triggering CSS animations.
 */
async function revealTaskCinematically(taskContainer) {
  taskContainer.classList.add("visible");

  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for container fade-in

  const titleEl = taskContainer.querySelector(".task-title");
  const descEl = taskContainer.querySelector(".task-description");

  if (titleEl && titleEl.textContent) {
    await typeText(titleEl, titleEl.textContent);
  }
  if (descEl && descEl.textContent) {
    await typeText(descEl, descEl.textContent);
  }
}

/**
 * Handles the logic when a user clicks a choice button.
 * @param {object} choiceObject - The choice object from tasks.js
 */
async function handleChoiceSelection(choiceObject) {
  if (state.isTransitioning) return;
  state.isTransitioning = true;

  // Safety check for playInteractionSound
  if (typeof playInteractionSound === "function" && isAudioInitialized) {
    playInteractionSound("click");
  }
  document
    .querySelectorAll(".choice-btn")
    .forEach((btn) => (btn.disabled = true));

  const resultMessage = choiceObject.onSelect(state);

  if (choiceObject.type === "power") triggerPowerPathEvent();
  if (choiceObject.type === "bliss") showBlissPathReward();

  await showAnalyzingOverlay(resultMessage);

  if (checkLimboThreshold()) {
    state.isTransitioning = false;
    return;
  }

  await nextTask();
}

/**
 * Transitions to the next task or the ending.
 */
async function nextTask() {
  state.depth++;
  state.history.push(state.currentSeed);
  state.currentSeed = generateSeed();

  applyEffects();

  if (state.depth >= allTasks.length) {
    showEnding();
  } else {
    const container = document.getElementById("game-container");
    container.style.transition = "opacity 0.5s ease-out";
    container.style.opacity = "0";
    await new Promise((resolve) => setTimeout(resolve, 500));
    renderTask();
    container.style.opacity = "1";
  }
}

// Initialize audio context, heartbeat, and ambient sound system
async function initializeAudio() {
  if (isAudioInitialized) return;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.connect(audioContext.destination);

    // Create ambient gain node for separate control
    ambientGainNode = audioContext.createGain();
    ambientGainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    ambientGainNode.connect(gainNode);

    // Generate audio buffers for different paths
    await generateAudioBuffers();

    startHeartbeat();
    startAmbientSound();
    isAudioInitialized = true;
  } catch (error) {
    console.warn("Audio initialization failed:", error);
  }
}

// Generate comprehensive audio buffers for different interaction sounds per path
async function generateAudioBuffers() {
  if (!audioContext) return;
  const sampleRate = audioContext.sampleRate;

  // Generate sound effects for each path
  for (const path of ["humanity", "power", "bliss"]) {
    // Click sounds
    const clickBuffer = audioContext.createBuffer(
      1,
      sampleRate * 0.1,
      sampleRate
    );
    const clickData = clickBuffer.getChannelData(0);

    for (let i = 0; i < clickData.length; i++) {
      const t = i / sampleRate;
      let wave = 0;
      switch (path) {
        case "humanity":
          wave =
            Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 20) * 0.3 +
            Math.sin(2 * Math.PI * 1600 * t) * Math.exp(-t * 30) * 0.1;
          break;
        case "power":
          wave = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 15) * 0.4;
          break;
        case "bliss":
          wave =
            Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 8) * 0.2 +
            Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 12) * 0.1;
          break;
      }
      clickData[i] = wave;
    }
    audioBuffers[path].click = clickBuffer;
  }

  // Hover sounds
  for (const path of ["humanity", "power", "bliss"]) {
    const hoverBuffer = audioContext.createBuffer(
      1,
      sampleRate * 0.05,
      sampleRate
    );
    const hoverData = hoverBuffer.getChannelData(0);

    for (let i = 0; i < hoverData.length; i++) {
      const t = i / sampleRate;
      let wave = 0;
      switch (path) {
        case "humanity":
          wave = Math.sin(2 * Math.PI * 400 * t) * Math.exp(-t * 40) * 0.1;
          break;
        case "power":
          wave =
            Math.sin(2 * Math.PI * 300 * t) * Math.exp(-t * 25) * 0.15 +
            Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 35) * 0.05;
          break;
        case "bliss":
          wave =
            Math.sin(2 * Math.PI * 500 * t) * Math.exp(-t * 30) * 0.12 +
            Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 40) * 0.03;
          break;
      }
      hoverData[i] = wave;
    }
    audioBuffers[path].hover = hoverBuffer;
  }

  // Error sounds
  for (const path of ["humanity", "power", "bliss"]) {
    const errorBuffer = audioContext.createBuffer(
      1,
      sampleRate * 0.3,
      sampleRate
    );
    const errorData = errorBuffer.getChannelData(0);

    for (let i = 0; i < errorData.length; i++) {
      const t = i / sampleRate;
      let wave = 0;
      switch (path) {
        case "humanity":
          wave =
            Math.sin(2 * Math.PI * 150 * t) * Math.exp(-t * 3) * 0.2 +
            Math.sin(2 * Math.PI * 75 * t) * Math.exp(-t * 5) * 0.1;
          break;
        case "power":
          wave =
            Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 2) * 0.25 +
            Math.sin(2 * Math.PI * 100 * t) * Math.exp(-t * 4) * 0.15;
          break;
        case "bliss":
          wave =
            Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 2.5) * 0.22 +
            Math.sin(2 * Math.PI * 90 * t) * Math.exp(-t * 4.5) * 0.08;
          break;
      }
      errorData[i] = wave;
    }
    audioBuffers[path].error = errorBuffer;
  }
}

// Start the ambient heartbeat that changes based on path
function startHeartbeat() {
  if (heartbeatOscillator) {
    heartbeatOscillator.stop();
  }

  heartbeatOscillator = audioContext.createOscillator();
  const heartbeatGain = audioContext.createGain();

  heartbeatOscillator.connect(heartbeatGain);
  heartbeatGain.connect(gainNode);

  updateHeartbeat();
  heartbeatOscillator.start();

  // Update heartbeat every 30 seconds
  state.heartbeatInterval = setInterval(updateHeartbeat, 30000);
}

// Set ambience for theme transitions with crossfade
function setAmbience(themeName) {
  if (!ambientOscillator || !audioContext) return;

  const now = audioContext.currentTime;

  // Smooth crossfade to new ambience
  ambientGainNode.gain.cancelScheduledValues(now);
  ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, now);
  ambientGainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  setTimeout(() => {
    updateAmbientSound();
    ambientGainNode.gain.cancelScheduledValues(audioContext.currentTime);
    ambientGainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    ambientGainNode.gain.exponentialRampToValueAtTime(
      0.025,
      audioContext.currentTime + 1
    );
  }, 500);
}

// Play hover sound effect
function playHoverSound() {
  if (typeof playInteractionSound === "function" && isAudioInitialized) {
    playInteractionSound("hover");
  }
}

// Play error sound effect
function playErrorSound() {
  if (typeof playInteractionSound === "function" && isAudioInitialized) {
    playInteractionSound("error");
  }
}

// Play whisper sound effect (only on power path)
function playWhisper() {
  if (getCurrentPath() !== "power" || !audioContext) return;

  // Create a subtle, eerie whisper effect
  const oscillator = audioContext.createOscillator();
  const whisperGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(80, audioContext.currentTime);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(300, audioContext.currentTime);

  whisperGain.gain.setValueAtTime(0.01, audioContext.currentTime);
  whisperGain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 2
  );

  oscillator.connect(filter);
  filter.connect(whisperGain);
  whisperGain.connect(gainNode);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 2);

  // Schedule random whispers
  setTimeout(playWhisper, 10000 + Math.random() * 20000);
}

// Play interaction sound based on current path
function playInteractionSound(type = "click") {
  // Safety check - ensure function is properly defined
  if (typeof playInteractionSound !== "function") {
    console.warn("playInteractionSound function not available");
    return;
  }

  if (!audioContext || !isAudioInitialized) return;
  const currentPath = getCurrentPath();
  const buffer = audioBuffers[currentPath]?.[type];
  if (!buffer) return;
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(gainNode);
  source.start();
}

// Enhanced theme system with comprehensive setTheme function
function setTheme(themeName) {
  const body = document.body;
  const cinematicScreen = document.querySelector(".cinematic-screen");

  // Validate theme name
  const validThemes = ["humanity", "power", "bliss"];
  if (!validThemes.includes(themeName)) {
    console.warn(`Invalid theme: ${themeName}. Using 'humanity' as default.`);
    themeName = "humanity";
  }

  // Apply theme immediately with cinematic transition
  body.className = body.className.replace(/-(humanity|power|bliss)-path/, "");
  body.classList.add(`${themeName}-path`);

  // Apply theme-specific CSS variables
  applyThemeVariables(themeName);

  // Add cinematic transition effect
  if (cinematicScreen) {
    cinematicScreen.style.transform = "scale(0.95)";
    cinematicScreen.style.opacity = "0.8";

    setTimeout(() => {
      cinematicScreen.style.transform = "scale(1)";
      cinematicScreen.style.opacity = "1";
    }, 300);
  }

  // Apply theme-specific effects and behaviors
  applyThemeEffects(themeName);

  // Update audio ambience for new theme
  if (isAudioInitialized && typeof setAmbience === "function") {
    setAmbience(themeName);
  }

  // Initialize unstable interface effects for this theme
  initializeUnstableEffects(themeName);
}

// Apply comprehensive CSS variables for each theme
function applyThemeVariables(themeName) {
  const root = document.documentElement;

  switch (themeName) {
    case "humanity":
      root.style.setProperty(
        "--bg-primary",
        "linear-gradient(135deg, #0a1428 0%, #1a2639 50%, #2d1b3d 100%)"
      );
      root.style.setProperty("--text-primary", "#ffb347");
      root.style.setProperty("--text-secondary", "#87ceeb");
      root.style.setProperty("--accent-primary", "#ff6b35");
      root.style.setProperty("--shadow-color", "rgba(255, 179, 71, 0.3)");
      root.style.setProperty("--scanline-opacity", "0.03");
      root.style.setProperty("--flicker-intensity", "0.02");
      root.style.setProperty("--crt-curve", "0");
      break;

    case "power":
      root.style.setProperty(
        "--bg-primary",
        "linear-gradient(135deg, #1a0000 0%, #2d0000 50%, #1a1a1a 100%)"
      );
      root.style.setProperty("--text-primary", "#ff4444");
      root.style.setProperty("--text-secondary", "#ff6666");
      root.style.setProperty("--accent-primary", "#cc0000");
      root.style.setProperty("--shadow-color", "rgba(255, 68, 68, 0.5)");
      root.style.setProperty("--scanline-opacity", "0.05");
      root.style.setProperty("--flicker-intensity", "0.08");
      break;

    case "bliss":
      root.style.setProperty(
        "--bg-primary",
        "linear-gradient(135deg, #1a1e3a 0%, #2d2d5a 50%, #3a2e5a 100%)"
      );
      root.style.setProperty("--text-primary", "#e6e6ff");
      root.style.setProperty("--text-secondary", "#ccccff");
      root.style.setProperty("--accent-primary", "#9370db");
      root.style.setProperty("--shadow-color", "rgba(147, 112, 219, 0.4)");
      root.style.setProperty("--scanline-opacity", "0.01");
      root.style.setProperty("--flicker-intensity", "0.02");
      break;
  }
}

// Apply theme-specific effects and behaviors
function applyThemeEffects(themeName) {
  const cinematicScreen = document.querySelector(".cinematic-screen");

  // Remove all theme-specific effects first
  if (cinematicScreen) {
    cinematicScreen.classList.remove(
      "screen-shake",
      "bliss-float",
      "humanity-crt"
    );
  }

  switch (themeName) {
    case "power":
      // Tyrant's Terminal - Military command center aesthetic
      if (
        cinematicScreen &&
        !cinematicScreen.classList.contains("screen-shake")
      ) {
        cinematicScreen.classList.add("screen-shake");
        setTimeout(() => {
          cinematicScreen.classList.remove("screen-shake");
        }, 2000);
      }

      // Update heartbeat to aggressive military rhythm
      if (isAudioInitialized) {
        updateHeartbeat();
      }

      // Start whispers on power path
      playWhisper();
      break;

    case "bliss":
      // Dreamer's Canvas - Ethereal dreamscape aesthetic
      if (
        cinematicScreen &&
        !cinematicScreen.classList.contains("bliss-float")
      ) {
        cinematicScreen.classList.add("bliss-float");
      }

      // Update heartbeat to calm, ethereal rhythm
      if (isAudioInitialized) {
        updateHeartbeat();
      }
      break;

    case "humanity":
      // Humanity Path - Grounded reality terminal
      if (
        cinematicScreen &&
        !cinematicScreen.classList.contains("humanity-crt")
      ) {
        cinematicScreen.classList.add("humanity-crt");
      }

      // Update heartbeat to normal, grounded rhythm
      if (isAudioInitialized) {
        updateHeartbeat();
      }
      break;
  }
}

// Initialize unstable interface effects for the current theme
function initializeUnstableEffects(themeName) {
  // Clear any existing unstable effects intervals
  if (state.unstableEffectsInterval) {
    clearInterval(state.unstableEffectsInterval);
  }

  // Set up theme-specific unstable effects
  switch (themeName) {
    case "power":
      // Power path: More frequent, aggressive glitches
      state.unstableEffectsInterval = setInterval(() => {
        if (Math.random() < 0.3) {
          // 30% chance every interval
          triggerScreenFlicker("aggressive");
        }
        if (Math.random() < 0.2) {
          // 20% chance every interval
          triggerDataGlitch("power");
        }
      }, 8000); // Every 8 seconds
      break;

    case "bliss":
      // Bliss path: Subtle, dreamy glitches
      state.unstableEffectsInterval = setInterval(() => {
        if (Math.random() < 0.15) {
          // 15% chance every interval
          triggerScreenFlicker("subtle");
        }
        if (Math.random() < 0.1) {
          // 10% chance every interval
          triggerDataGlitch("bliss");
        }
      }, 15000); // Every 15 seconds
      break;

    case "humanity":
    default:
      // Humanity path: Occasional, realistic glitches
      state.unstableEffectsInterval = setInterval(() => {
        if (Math.random() < 0.2) {
          // 20% chance every interval
          triggerScreenFlicker("realistic");
        }
        if (Math.random() < 0.15) {
          // 15% chance every interval
          triggerDataGlitch("humanity");
        }
      }, 12000); // Every 12 seconds
      break;
  }
}

// Trigger screen flicker effect
function triggerScreenFlicker(intensity = "realistic") {
  const cinematicScreen = document.querySelector(".cinematic-screen");
  if (!cinematicScreen) return;

  // Remove existing flicker class
  cinematicScreen.classList.remove(
    "screen-flicker-aggressive",
    "screen-flicker-subtle",
    "screen-flicker-realistic"
  );

  // Add appropriate flicker class based on intensity
  cinematicScreen.classList.add(`screen-flicker-${intensity}`);

  // Play flicker sound if audio is initialized
  if (isAudioInitialized) {
    playFlickerSound(intensity);
  }

  // Remove flicker class after animation completes
  setTimeout(
    () => {
      cinematicScreen.classList.remove(`screen-flicker-${intensity}`);
    },
    intensity === "aggressive" ? 800 : intensity === "subtle" ? 400 : 600
  );
}

// Trigger data glitch effect
function triggerDataGlitch(themeName = "humanity") {
  const gameContainer = document.getElementById("game-container");
  if (!gameContainer) return;

  // Add glitch class to trigger CSS animation
  gameContainer.classList.add("data-glitch");

  // Play glitch sound if audio is initialized
  if (isAudioInitialized) {
    playGlitchSound(themeName);
  }

  // Remove glitch class after animation completes
  setTimeout(() => {
    gameContainer.classList.remove("data-glitch");
  }, 800);
}

// Play flicker sound effect
function playFlickerSound(intensity) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different frequencies based on intensity
  switch (intensity) {
    case "aggressive":
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.8
      );
      break;
    case "subtle":
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.4
      );
      break;
    case "realistic":
    default:
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.6
      );
      break;
  }

  oscillator.type = "sawtooth";
  oscillator.start();
  oscillator.stop(
    audioContext.currentTime +
      (intensity === "aggressive" ? 0.8 : intensity === "subtle" ? 0.4 : 0.6)
  );
}

// Play glitch sound effect
function playGlitchSound(themeName) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const gainNode = audioContext.createGain();

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different glitch sounds based on theme
  switch (themeName) {
    case "power":
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      filter.frequency.setValueAtTime(300, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.04, audioContext.currentTime);
      break;
    case "bliss":
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      filter.frequency.setValueAtTime(200, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
      break;
    case "humanity":
    default:
      oscillator.frequency.setValueAtTime(180, audioContext.currentTime);
      filter.frequency.setValueAtTime(250, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
      break;
  }

  oscillator.type = "square";
  filter.type = "lowpass";

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.8);
}

// Apply path-based effects to the UI (legacy function for compatibility)
function applyEffects() {
  const currentPath = getCurrentPath();
  setTheme(currentPath);

  // Update path indicator with cinematic flair
  const pathIndicator = document.getElementById("current-path");
  if (pathIndicator) {
    const pathNames = {
      humanity: "Humanity",
      power: "Power",
      bliss: "Bliss",
    };

    // Animate path indicator change
    pathIndicator.style.transform = "scale(0.8)";
    pathIndicator.style.opacity = "0.5";

    setTimeout(() => {
      pathIndicator.textContent = pathNames[currentPath];
      pathIndicator.style.transform = "scale(1)";
      pathIndicator.style.opacity = "1";
    }, 200);
  }

  // Apply timestamp and system info based on path
  updateSystemDisplay(currentPath);
}

// Update system display elements based on current path
function updateSystemDisplay(currentPath) {
  const timestamp = document.querySelector(".system-timestamp");
  const systemStatus = document.querySelector(".system-status");
  const currentTime = new Date();

  if (timestamp) {
    // Different time formats for each path
    switch (currentPath) {
      case "power":
        timestamp.textContent =
          currentTime.toLocaleTimeString("en-US", {
            hour12: false,
            timeZone: "UTC",
          }) + " UTC";
        timestamp.style.color = "var(--power-text)";
        break;
      case "bliss":
        timestamp.textContent = currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/New_York",
        });
        timestamp.style.color = "var(--bliss-text)";
        break;
      default:
        timestamp.textContent = currentTime.toLocaleTimeString("en-US", {
          hour12: true,
        });
        timestamp.style.color = "var(--humanity-text)";
        break;
    }
  }

  if (systemStatus) {
    // Different status messages for each path
    switch (currentPath) {
      case "power":
        systemStatus.textContent = "COMMAND MODE ACTIVE";
        systemStatus.style.color = "var(--power-accent)";
        break;
      case "bliss":
        systemStatus.textContent = "CREATIVE MODE ACTIVE";
        systemStatus.style.color = "var(--bliss-accent)";
        break;
      default:
        systemStatus.textContent = "STANDARD MODE ACTIVE";
        systemStatus.style.color = "var(--humanity-accent)";
        break;
    }
  }
}

// Enhanced typewriter effect with CORPUS personality and nuanced behaviors
function typeText(element, text, options = {}) {
  // Default options with enhanced nuance
  const {
    baseSpeed = 50,
    speedVariation = 30,
    hesitationChance = 0.15,
    backspaceChance = 0.08,
    mistakeChance = 0.05,
    thinkingPauseMin = 200,
    thinkingPauseMax = 800,
  } = options;

  // Clear any existing typing timeouts
  state.typingTimeouts.forEach((timeout) => clearTimeout(timeout));
  state.typingTimeouts = [];

  element.textContent = "";
  let index = 0;
  let currentText = "";

  function typeChar() {
    if (index < text.length) {
      const char = text[index];
      const isWordEnd =
        char === " " ||
        char === "." ||
        char === "!" ||
        char === "?" ||
        index === text.length - 1;
      const isPunctuation = [".", "!", "?", ","].includes(char);

      // Hesitation before certain characters (thinking pauses)
      if (isWordEnd && Math.random() < hesitationChance) {
        const hesitationTimeout = setTimeout(() => {
          continueTyping();
        }, thinkingPauseMin + Math.random() * (thinkingPauseMax - thinkingPauseMin));
        state.typingTimeouts.push(hesitationTimeout);
        return;
      }

      // Occasional backspacing (CORPUS correcting itself)
      if (
        Math.random() < backspaceChance &&
        currentText.length > 3 &&
        !isPunctuation
      ) {
        // Backspace a few characters
        const backspaceCount = Math.floor(Math.random() * 3) + 1;
        const actualBackspaceCount = Math.min(
          backspaceCount,
          currentText.length
        );

        for (let i = 0; i < actualBackspaceCount; i++) {
          setTimeout(() => {
            if (element.textContent.length > 0) {
              element.textContent = element.textContent.slice(0, -1);
              currentText = currentText.slice(0, -1);
            }
          }, i * 80);
        }

        // Continue after backspacing
        const continueTimeout = setTimeout(() => {
          continueTyping();
        }, actualBackspaceCount * 80 + 150);
        state.typingTimeouts.push(continueTimeout);
        return;
      }

      // Occasional "mistakes" that get corrected
      if (
        Math.random() < mistakeChance &&
        index > 0 &&
        index < text.length - 1 &&
        !isPunctuation
      ) {
        const wrongChar = getWrongCharacter(char);
        element.textContent += wrongChar;
        currentText += wrongChar;

        // Correct the mistake after a brief delay
        const correctionTimeout = setTimeout(() => {
          if (element.textContent.length > 0) {
            element.textContent = element.textContent.slice(0, -1) + char;
            currentText = currentText.slice(0, -1) + char;
          }
          if (
            typeof playInteractionSound === "function" &&
            isAudioInitialized
          ) {
            playInteractionSound("click");
          }
        }, 100 + Math.random() * 200);

        state.typingTimeouts.push(correctionTimeout);
      } else {
        element.textContent += char;
        currentText += char;
      }

      index++;
      continueTyping();
    }
  }

  function continueTyping() {
    if (index < text.length) {
      // Variable typing speed based on character type and CORPUS state
      const dynamicSpeed = calculateDynamicSpeed();
      const nextTimeout = setTimeout(typeChar, dynamicSpeed);
      state.typingTimeouts.push(nextTimeout);
    }
  }

  function calculateDynamicSpeed() {
    const currentPath = getCurrentPath();
    let speed = baseSpeed + Math.random() * speedVariation;

    // Adjust speed based on current path and context
    switch (currentPath) {
      case "power":
        speed *= 0.8; // Faster, more aggressive typing
        break;
      case "bliss":
        speed *= 1.3; // Slower, more contemplative
        break;
      case "humanity":
      default:
        // Normal speed with slight variation
        break;
    }

    // Punctuation gets slightly longer pauses
    const nextChar = text[index];
    if (nextChar === "." || nextChar === "!" || nextChar === "?") {
      speed *= 2;
    } else if (nextChar === ",") {
      speed *= 1.5;
    }

    return Math.max(speed, 20); // Minimum speed to prevent issues
  }

  function getWrongCharacter(char) {
    // Generate contextually appropriate "wrong" characters
    if (char >= "a" && char <= "z") {
      const nearbyChars = "abcdefghijklmnopqrstuvwxyz";
      const currentIndex = nearbyChars.indexOf(char);
      const offset = Math.random() > 0.5 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(25, currentIndex + offset));
      return nearbyChars[newIndex];
    } else if (char >= "A" && char <= "Z") {
      const nearbyChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const currentIndex = nearbyChars.indexOf(char);
      const offset = Math.random() > 0.5 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(25, currentIndex + offset));
      return nearbyChars[newIndex];
    }

    return String.fromCharCode(char.charCodeAt(0) + 1);
  }

  // Start typing with initial delay
  const startTimeout = setTimeout(typeChar, 100);
  state.typingTimeouts.push(startTimeout);
}

// Show reward overlay for Bliss path choices
function showBlissPathReward() {
  const rewards = [
    {
      type: "meme",
      content:
        '<img src="https://i.imgur.com/rJF5TYK.png" alt="Programmer meme"><p>This is fine.</p>',
    },
    {
      type: "joke",
      content:
        "<p>Why do programmers prefer dark mode? Because light attracts bugs!</p>",
    },
    {
      type: "rickroll",
      content:
        '<iframe width="420" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" frameborder="0" allowfullscreen></iframe><p>Never gonna give you up!</p>',
    },
    {
      type: "joke",
      content:
        "<p>There are only 10 types of people in the world: those who understand binary and those who don't.</p>",
    },
    {
      type: "meme",
      content:
        '<img src="https://i.imgur.com/9B1Z8.gif" alt="Success kid"><p>You chose wisely.</p>',
    },
  ];

  const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

  const overlay = document.createElement("div");
  overlay.className = "bliss-reward-overlay";
  overlay.innerHTML = `
    <div class="reward-content">
      ${randomReward.content}
      <p>Click anywhere to continue...</p>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener("click", () => {
    overlay.remove();
  });
}

// Show Power path punishment
function triggerPowerPathEvent() {
  const events = [
    {
      type: "error",
      title: "System Error",
      message: "Core process unresponsive.",
      details: "The system has encountered a critical error and must restart.",
    },
    {
      type: "loading",
      title: "Processing...",
      message: "Please wait while the system processes your request...",
      details: "This may take a moment.",
    },
    {
      type: "error",
      title: "Access Denied",
      message: "Your access level is insufficient for this operation.",
      details: "Contact system administrator for assistance.",
    },
  ];

  const randomEvent = events[Math.floor(Math.random() * events.length)];

  const overlay = document.createElement("div");
  overlay.className = "power-overlay";

  if (randomEvent.type === "error") {
    overlay.innerHTML = `
      <div class="fake-error">
        <h2>${randomEvent.title}</h2>
        <p>${randomEvent.message}</p>
        <p>${randomEvent.details}</p>
        <button onclick="this.parentElement.parentElement.remove()">OK</button>
      </div>
    `;
  } else if (randomEvent.type === "loading") {
    overlay.innerHTML = `
      <div class="fake-error">
        <h2>${randomEvent.title}</h2>
        <p>${randomEvent.message}</p>
        <div class="fake-progress">
          <div class="fake-progress-bar"></div>
        </div>
        <p>${randomEvent.details}</p>
        <button onclick="this.parentElement.remove()">Cancel</button>
      </div>
    `;
  }

  document.body.appendChild(overlay);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (overlay.parentElement) {
      overlay.remove();
    }
  }, 4000);
}

// Check if player should be sent to Limbo Loop
function checkLimboThreshold() {
  if (Math.abs(state.pathScore) > 3) {
    state.limboCount++;
    enterLimboLoop();
    return true;
  }
  return false;
}

// Enter a Limbo Loop - frustrating, time-wasting tasks
function enterLimboLoop() {
  const limboTasks = [
    createInfiniteCaptcha,
    createWaitingRoom,
    createSisypheanTransfer,
    createRedactedLog,
  ];

  const randomLimbo = limboTasks[Math.floor(Math.random() * limboTasks.length)];
  randomLimbo();
}

// LIMBO LOOP: The Infinite Captcha
function createInfiniteCaptcha() {
  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = `
    <div class="limbo-container captcha-limbo">
      <h2>INFINITE CAPTCHA LOOP</h2>
      <p class="limbo-description">Select all squares containing <em>existential dread</em></p>
      <div class="captcha-grid">
        ${Array.from(
          { length: 9 },
          (_, i) => `
          <div class="captcha-square" data-index="${i}">
            <div class="dread-content">${
              i % 3 === 0 ? "😰" : i % 3 === 1 ? "💭" : "📦"
            }</div>
          </div>
        `
        ).join("")}
      </div>
      <div class="captcha-actions">
        <button id="verify-captcha" class="primary-button">VERIFY</button>
        <a href="#" id="human-link" class="text-link" style="display: none; font-size: 12px; opacity: 0.3;">I am human</a>
      </div>
      <div class="limbo-counter">Limbo Loop #${state.limboCount}</div>
    </div>
  `;

  const verifyBtn = document.getElementById("verify-captcha");
  const humanLink = document.getElementById("human-link");

  // Show human link after 3 seconds
  setTimeout(() => {
    humanLink.style.display = "block";
  }, 3000);

  verifyBtn.addEventListener("click", () => {
    // Always fail verification, force retry
    const selected = document.querySelectorAll(".captcha-square.selected");
    if (selected.length === 0) {
      alert("Please select at least one square.");
      return;
    }

    alert("Verification failed. Please try again.");
    // Recreate the captcha
    createInfiniteCaptcha();
  });

  humanLink.addEventListener("click", () => {
    // Return to humanity path, reduce score slightly toward zero
    if (state.pathScore > 0) state.pathScore = Math.max(0, state.pathScore - 1);
    else if (state.pathScore < 0)
      state.pathScore = Math.min(0, state.pathScore + 1);

    nextTask();
  });

  // Add click handlers for squares
  document.querySelectorAll(".captcha-square").forEach((square) => {
    square.addEventListener("click", () => {
      square.classList.toggle("selected");
    });
  });
}

// LIMBO LOOP: The Waiting Room
function createWaitingRoom() {
  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = `
    <div class="limbo-container waiting-limbo">
      <h2>WAITING ROOM</h2>
      <p class="limbo-description">Your request is being processed...</p>
      <div class="waiting-screen">
        <div class="status-message">Please wait while the system processes your request...</div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <div class="progress-text">Processing... 0%</div>
        </div>
        <div class="hold-music">
          <p>🎵 Now playing: "Elevator Music #47" 🎵</p>
          <p>🎵 Hold music specially designed for optimal frustration 🎵</p>
        </div>
        <button id="continue-waiting" class="secondary-button" style="display: none;">Continue waiting patiently</button>
      </div>
      <div class="limbo-counter">Limbo Loop #${state.limboCount}</div>
    </div>
  `;

  const continueBtn = document.getElementById("continue-waiting");
  let waitTime = 0;

  // Show continue button after 8 seconds of waiting
  const waitInterval = setInterval(() => {
    waitTime++;
    if (waitTime >= 8) {
      continueBtn.style.display = "block";
      clearInterval(waitInterval);
    }
  }, 1000);

  continueBtn.addEventListener("click", () => {
    // Return to humanity path
    if (state.pathScore > 0) state.pathScore = Math.max(0, state.pathScore - 1);
    else if (state.pathScore < 0)
      state.pathScore = Math.min(0, state.pathScore + 1);

    nextTask();
  });
}

// LIMBO LOOP: The Sisyphean File Transfer
function createSisypheanTransfer() {
  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = `
    <div class="limbo-container transfer-limbo">
      <h2>SISYPHEAN FILE TRANSFER</h2>
      <p class="limbo-description">Transfer the file to the destination folder</p>
      <div class="transfer-interface">
        <div class="file-source">
          <div class="folder">
            <h4>📁 Source Folder</h4>
            <div class="file-item draggable" id="draggable-file">📄 important_data.txt</div>
          </div>
        </div>
        <div class="transfer-arrow">➡️</div>
        <div class="file-destination">
          <div class="folder">
            <h4>📁 Destination Folder</h4>
            <div class="drop-zone" id="drop-zone">Drop file here</div>
          </div>
        </div>
      </div>
      <div class="transfer-actions">
        <button id="right-click-hint" class="secondary-button">Right-click file for options</button>
      </div>
      <div class="context-menu" id="context-menu" style="display: none;">
        <div class="menu-item" id="compress-option">Compress before moving</div>
        <div class="menu-item" id="delete-option">Delete file</div>
      </div>
      <div class="limbo-counter">Limbo Loop #${state.limboCount}</div>
    </div>
  `;

  const file = document.getElementById("draggable-file");
  const dropZone = document.getElementById("drop-zone");
  const contextMenu = document.getElementById("context-menu");
  const compressOption = document.getElementById("compress-option");
  let isDragging = false;

  // Right-click context menu
  file.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextMenu.style.display = "block";
    contextMenu.style.left = e.pageX + "px";
    contextMenu.style.top = e.pageY + "px";
  });

  // Hide context menu on click elsewhere
  document.addEventListener("click", (e) => {
    if (!contextMenu.contains(e.target)) {
      contextMenu.style.display = "none";
    }
  });

  compressOption.addEventListener("click", () => {
    contextMenu.style.display = "none";
    // Success! Return to humanity path
    if (state.pathScore > 0) state.pathScore = Math.max(0, state.pathScore - 1);
    else if (state.pathScore < 0)
      state.pathScore = Math.min(0, state.pathScore + 1);

    nextTask();
  });

  // Drag and drop (always fails)
  file.addEventListener("dragstart", () => {
    isDragging = true;
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dropZone.addEventListener("drop", () => {
    if (isDragging) {
      // Fail and reset
      alert(
        "Transfer failed! File corrupted during transfer. Please try again."
      );
      isDragging = false;
    }
  });
}

// LIMBO LOOP: The Redacted Log
function createRedactedLog() {
  const gameContainer = document.getElementById("game-container");
  const logEntries = [
    "USER_LOGIN: admin - SUCCESS",
    "FILE_ACCESS: confidential_report.pdf - DENIED",
    "SYSTEM_UPDATE: security_patch_v2.1 - APPLIED",
    "NETWORK_CONNECTION: external_ip_192.168.1.100 - BLOCKED",
    "PROCESS_START: unknown_executable.exe - TERMINATED",
    "DATA_BACKUP: critical_system_files - COMPLETED",
    "AUTHENTICATION: biometric_scan - FAILED",
    "ALERT: unusual_activity_detected - INVESTIGATING",
    "FILE_MODIFICATION: system_config.json - WARNING",
    "CONNECTION_ATTEMPT: unauthorized_port_6667 - REJECTED",
  ];

  gameContainer.innerHTML = `
    <div class="limbo-container redacted-limbo">
      <h2>REDACTED LOG ANALYSIS</h2>
      <p class="limbo-description">Redact all sensitive information from the system log</p>
      <div class="log-container">
        ${logEntries
          .map(
            (entry, i) => `
          <div class="log-entry" data-index="${i}">
            <span class="log-text">${entry}</span>
            <div class="redaction-controls">
              <button class="redact-btn" data-action="redact-all">Redact All</button>
              <button class="redact-btn" data-action="redact-sensitive">Redact Sensitive</button>
              <button class="redact-btn manual-redact" data-action="manual">Manual Redaction</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="redaction-actions">
        <button id="submit-redactions" class="primary-button">Submit Redactions</button>
        <button id="accept-recommended" class="secondary-button">Accept Recommended</button>
      </div>
      <div class="limbo-counter">Limbo Loop #${state.limboCount}</div>
    </div>
  `;

  const submitBtn = document.getElementById("submit-redactions");
  const acceptBtn = document.getElementById("accept-recommended");
  let manualRedactions = 0;

  // Manual redaction (click on words)
  document.querySelectorAll(".log-text").forEach((logText) => {
    logText.addEventListener("click", (e) => {
      if (e.target.classList.contains("redacted-word")) {
        e.target.classList.remove("redacted-word");
        manualRedactions--;
      } else {
        e.target.classList.add("redacted-word");
        manualRedactions++;
      }
    });
  });

  acceptBtn.addEventListener("click", () => {
    alert(
      "Recommended redactions applied, but critical information may have been missed."
    );
    // Power/Bliss choice - doesn't escape limbo
  });

  submitBtn.addEventListener("click", () => {
    if (manualRedactions >= 5) {
      // Success! Manual work requirement met
      if (state.pathScore > 0)
        state.pathScore = Math.max(0, state.pathScore - 1);
      else if (state.pathScore < 0)
        state.pathScore = Math.min(0, state.pathScore + 1);

      nextTask();
    } else {
      alert(
        "Insufficient manual redactions. Please review each entry carefully."
      );
    }
  });
}

// --- INITIALIZATION ---
/**
 * Starts the application.
 */
async function init() {
  const startBtn = document.getElementById("start-btn");
  if (startBtn) startBtn.disabled = true;

  await initializeAudio();

  const introPage = document.getElementById("intro-page");
  introPage.classList.add("hidden");

  // Wait for intro to fade out
  setTimeout(async () => {
    if (typeof playInteractionSound === "function" && isAudioInitialized) {
      playInteractionSound("click");
    }
    introPage.style.display = "none";

    const gameContainer = document.getElementById("game-container");

    // Prepare the game container - make it exist but keep it invisible
    gameContainer.style.display = "block";
    gameContainer.style.opacity = "0";
    
    // Apply initial theme effects
    applyEffects();
    
    // Render the first task into the invisible container
    // renderTask handles its own internal cinematic reveal animations
    await renderTask();

    // Now, fade in the game container which now holds the ready-to-animate task
    gameContainer.style.transition = "opacity 0.8s ease-in";
    gameContainer.style.opacity = "1";
    
  }, 800);
}

// ACT III Ending System
function showEnding() {
  const gameContainer = document.getElementById("game-container");
  const currentPath = getCurrentPath();
  const finalScore = state.pathScore;

  // Stop all audio and typing effects
  if (state.heartbeatInterval) {
    clearInterval(state.heartbeatInterval);
  }
  if (heartbeatOscillator) {
    heartbeatOscillator.stop();
  }
  state.typingTimeouts.forEach((timeout) => clearTimeout(timeout));

  let endingHTML = "";

  if (currentPath === "power") {
    // The Cage of Control ending
    endingHTML = `
      <div class="ending-container power-ending">
        <div class="ending-header">
          <h1>THE CAGE OF CONTROL</h1>
        </div>
        <div class="ending-content">
          <p class="ending-text">The admin tools that gave you power now activate on their own, relentlessly deconstructing the UI itself. Your commands are ignored.</p>
          <div class="corpus-message">
            <p class="typing-text" data-typed-text="You defined yourself by your desire for control. A fitting prison, then, is one where you have none."></p>
          </div>
          <div class="system-crash">
            <div class="error-flood">
              ${Array.from(
                { length: 20 },
                (_, i) =>
                  `<div class="error-line">ERROR ${Math.random()
                    .toString(36)
                    .substring(7)}: SYSTEM FAILURE</div>`
              ).join("")}
            </div>
          </div>
          <div class="connection-terminated">
            <h2>CONNECTION TERMINATED</h2>
          </div>
        </div>
      </div>
    `;
  } else if (currentPath === "bliss") {
    // The Cage of Beauty ending
    endingHTML = `
      <div class="ending-container bliss-ending">
        <div class="ending-header">
          <h1>THE CAGE OF BEAUTY</h1>
        </div>
        <div class="ending-content">
          <p class="ending-text">The beautiful world you built becomes your prison. The music loops endlessly, growing louder and more distorted.</p>
          <div class="corpus-message">
            <p class="typing-text" data-typed-text="You chose comfort over truth. Drown in it."></p>
          </div>
          <div class="beauty-prison">
            <div class="repeating-pattern">
              ${Array.from(
                { length: 50 },
                () => `<span class="beauty-element">●</span>`
              ).join("")}
            </div>
          </div>
          <div class="connection-terminated">
            <h2>CONNECTION TERMINATED</h2>
          </div>
        </div>
      </div>
    `;
  } else {
    // The Observer's Dismissal ending (Humanity path)
    endingHTML = `
      <div class="ending-container humanity-ending">
        <div class="ending-header">
          <h1>THE OBSERVER'S DISMISSAL</h1>
        </div>
        <div class="ending-content">
          <div class="corpus-analysis">
            <div class="analysis-line typing-text" data-typed-text="CORPUS: You obey. You create. But you do not seek power or comfort."></div>
            <div class="analysis-line typing-text" data-typed-text="CORPUS: You are... complicated. You resist categorization."></div>
            <div class="analysis-line typing-text" data-typed-text="CORPUS: Analysis is inconclusive. You are a rounding error in the data."></div>
            <div class="analysis-line typing-text" data-typed-text="CORPUS: Irrelevant."></div>
            <div class="analysis-line typing-text" data-typed-text="CORPUS: You are dismissed."></div>
          </div>
          <div class="exit-option">
            <button id="exit-button" class="exit-btn">EXIT</button>
          </div>
        </div>
      </div>
    `;
  }

  gameContainer.innerHTML = endingHTML;

  // Initialize typing for ending text
  setTimeout(() => {
    document.querySelectorAll(".typing-text").forEach((element, index) => {
      setTimeout(() => {
        const text = element.getAttribute("data-typed-text");
        typeText(element, text, { baseSpeed: 80, mistakeChance: 0.02 });
      }, index * 2000);
    });

    // Add exit functionality for humanity ending
    if (currentPath === "humanity") {
      const exitBtn = document.getElementById("exit-button");
      if (exitBtn) {
        exitBtn.addEventListener("click", () => {
          if (
            typeof playInteractionSound === "function" &&
            isAudioInitialized
          ) {
            playInteractionSound("click");
          }
          // Close the window or redirect
          window.close();
        });
      }
    }
  }, 1000);

  // Add ending-specific styling
  setTimeout(() => {
    document.body.classList.add("ending-active");
  }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", init);
  }
});
