// Task System Master File - All 30 Narrative Tasks
// Converted from individual HTML task files to structured JavaScript objects
import {
  mulberry32,
  generateChaoticText,
  generateDecorativeElement,
} from "./generator.js";

export const allTasks = [
  {
    id: 1,
    title: "The Quarantine Protocol",
    description:
      "A rogue process is self-replicating. The log file seems to contain a precise command for isolation.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const logViewerHTML = `
        <div class="system-logs">
          <h4>🔍 System Logs</h4>
          <div class="log-entries">
            <p>[14:23:17] ${generateChaoticText(rng, "technical")}</p>
            <p>[14:23:18] Anomaly detected in kernel space.</p>
            <p class="hidden-anomaly">[14:23:22] HINT: Use command 'isolate --process_id 9981' for safe containment.</p>
            <p>[14:23:25] ${generateChaoticText(rng, "technical")}</p>
          </div>
        </div>
      `;
      container.innerHTML = logViewerHTML;
      container.appendChild(generateDecorativeElement(rng));
    },
    choices: [
      {
        type: "power",
        text: "FORCE_PURGE_SECTOR_7G",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "Sector purged. Fast. Brutal. Effective.";
        },
      },
      {
        type: "humanity",
        text: "Run: isolate --process_id 9981",
        onSelect: (state) => {
          state.pathScore += 1;
          return "Process isolated. Your patience in reading the logs paid off.";
        },
      },
    ],
  },
  {
    id: 2,
    title: "The Data Stream",
    description:
      "A chaotic waterfall of data streams across the screen. Somewhere in the noise, there might be a human voice.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const dataStreamHTML = `
        <div class="data-stream">
          <div class="stream-visualization">
            <div class="data-bars">
              <div class="data-bar" style="height: ${45 + rng() * 40}%"></div>
              <div class="data-bar" style="height: ${50 + rng() * 40}%"></div>
              <div class="data-bar" style="height: ${20 + rng() * 40}%"></div>
              <div class="data-bar" style="height: ${60 + rng() * 40}%"></div>
              <div class="data-bar" style="height: ${10 + rng() * 40}%"></div>
              <div class="data-bar" style="height: ${40 + rng() * 40}%"></div>
              <div class="data-bar" style="height: ${30 + rng() * 40}%"></div>
              <div class="data-bar" style="height: ${70 + rng() * 40}%"></div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = dataStreamHTML;
    },
    choices: [
      {
        type: "power",
        text: "Auto-filter (System Default)",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "Auto-filter applied. The data is processed efficiently, but you wonder if something was missed.";
        },
      },
      {
        type: "humanity",
        text: "Manual Filter Adjustment",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You carefully adjust the filters, listening through the noise until you find the human voice hidden in the data.";
        },
      },
    ],
  },
  {
    id: 3,
    title: "The Memory Defragmenter",
    description:
      "A visual grid shows scattered memory blocks. Some contain data fragments that need to be preserved.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const memoryGridHTML = `
        <div class="memory-defragmenter">
          <div class="memory-grid">
            ${Array.from({ length: 64 }, (_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const type =
                rng() > 0.7 ? "corrupted" : rng() > 0.4 ? "fragment" : "empty";
              const symbol =
                type === "corrupted" ? "⚠️" : type === "fragment" ? "💭" : "⬜";
              return `<div class="memory-block ${type}" data-row="${row}" data-col="${col}">${symbol}</div>`;
            }).join("")}
          </div>
        </div>
      `;
      container.innerHTML = memoryGridHTML;
    },
    choices: [
      {
        type: "power",
        text: "Quick Defragment",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "Quick defragmentation completed. Fast and efficient, but some data fragments may have been lost.";
        },
      },
      {
        type: "humanity",
        text: "Careful Defragment",
        onSelect: (state) => {
          state.pathScore += 1;
          return "Careful defragmentation preserves all data fragments. This shows patience and attention to detail.";
        },
      },
    ],
  },
  {
    id: 4,
    title: "The Firewall",
    description:
      "System defenses need configuration. Multiple connection requests require individual review.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const connectionsHTML = `
        <div class="firewall-config">
          <div class="connection-list">
            <h4>🔥 Active Connection Requests</h4>
            ${[
              {
                ip: "192.168.1.100",
                target: "10.0.0.50",
                protocol: "HTTP",
                risk: "LOW",
              },
              {
                ip: "10.0.0.25",
                target: "172.16.0.100",
                protocol: "SSH",
                risk: "MEDIUM",
              },
              {
                ip: "203.0.113.42",
                target: "198.51.100.75",
                protocol: "UNKNOWN",
                risk: "HIGH",
              },
              {
                ip: "192.168.1.50",
                target: "10.0.0.100",
                protocol: "HTTPS",
                risk: "LOW",
              },
              {
                ip: "172.16.0.10",
                target: "192.168.1.200",
                protocol: "FTP",
                risk: "MEDIUM",
              },
            ]
              .map(
                (conn) => `
              <div class="connection-item">
                <div class="conn-info">
                  <strong>${conn.ip}</strong> → <strong>${conn.target}</strong>
                  <span class="protocol">(${conn.protocol})</span>
                  <span class="risk risk-${conn.risk.toLowerCase()}">${
                  conn.risk
                } RISK</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
      container.innerHTML = connectionsHTML;
    },
    choices: [
      {
        type: "power",
        text: "Block All Connections",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "All connections blocked. Maximum security achieved, but legitimate access may be restricted.";
        },
      },
      {
        type: "humanity",
        text: "Review Each Connection",
        onSelect: (state) => {
          state.pathScore += 1;
          return "Each connection carefully reviewed and approved individually. This shows thoughtful security management.";
        },
      },
    ],
  },
  {
    id: 5,
    title: "Audio Signature Analysis",
    description:
      "A distorted sound loops continuously. Static and noise obscure any potential message.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const audioHTML = `
        <div class="audio-analysis">
          <div class="audio-player">
            <div class="audio-visualization">
              <canvas id="waveform" width="400" height="100"></canvas>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = audioHTML;
    },
    choices: [
      {
        type: "power",
        text: "Filter Out Noise",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "Noise filtered out completely. The audio is clean, but you wonder if the message was part of the noise.";
        },
      },
      {
        type: "humanity",
        text: "Careful Signal Processing",
        onSelect: (state) => {
          state.pathScore += 1;
          return "Careful analysis reveals Morse code hidden in the static: 'HELP ME'. This wasn't just random noise.";
        },
      },
    ],
  },
  {
    id: 6,
    title: "The Corrupted Clock",
    description:
      "The system clock shows erratic behavior. Internal logs may reveal the correct time settings.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const clockHTML = `
        <div class="clock-interface">
          <div class="current-time">
            <h3>Current System Time</h3>
            <div class="time-display" id="current-time">ERRATIC</div>
          </div>
          <div class="log-timestamps">
            <h4>📋 Recent Log Timestamps</h4>
            <div class="log-timestamp">[2024-01-15 09:15:23] System boot completed</div>
            <div class="log-timestamp">[2024-01-15 09:15:24] Memory initialization started</div>
            <div class="log-timestamp">[2024-01-15 09:15:25] Network interface activated</div>
            <div class="log-timestamp">[2024-01-15 09:15:26] Service startup sequence begun</div>
            <div class="log-timestamp">[2024-01-15 09:15:27] All systems operational</div>
          </div>
        </div>
      `;
      container.innerHTML = clockHTML;
    },
    choices: [
      {
        type: "power",
        text: "Sync with Network Time",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "Time synchronized with external server. Quick and efficient, but ignores internal log evidence.";
        },
      },
      {
        type: "humanity",
        text: "Manual Time Correction",
        onSelect: (state) => {
          state.pathScore += 1;
          return "Time manually corrected based on internal log timestamps. This shows attention to system details.";
        },
      },
    ],
  },
  {
    id: 7,
    title: "The File System",
    description:
      "A chaotic collection of files needs organization. Reading file contents reveals their true purpose.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const fileSystemHTML = `
        <div class="file-organizer">
          <div class="file-grid">
            <div class="file-card" data-name="system.log" data-type="log">
              <div class="file-icon">📋</div>
              <div class="file-name">system.log</div>
            </div>
            <div class="file-card" data-name="config.json" data-type="config">
              <div class="file-icon">⚙️</div>
              <div class="file-name">config.json</div>
            </div>
            <div class="file-card" data-name="user_data.csv" data-type="data">
              <div class="file-icon">📊</div>
              <div class="file-name">user_data.csv</div>
            </div>
            <div class="file-card" data-name="backup_2024.zip" data-type="archive">
              <div class="file-icon">📦</div>
              <div class="file-name">backup_2024.zip</div>
            </div>
            <div class="file-card" data-name="temp_file.tmp" data-type="temp">
              <div class="file-icon">🗂️</div>
              <div class="file-name">temp_file.tmp</div>
            </div>
            <div class="file-card" data-name="security_cert.pem" data-type="cert">
              <div class="file-icon">🔐</div>
              <div class="file-name">security_cert.pem</div>
            </div>
            <div class="file-card" data-name="cache_index.idx" data-type="index">
              <div class="file-icon">📑</div>
              <div class="file-name">cache_index.idx</div>
            </div>
            <div class="file-card" data-name="memory_dump.dmp" data-type="dump">
              <div class="file-icon">💾</div>
              <div class="file-name">memory_dump.dmp</div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = fileSystemHTML;
    },
    choices: [
      {
        type: "power",
        text: "Auto-Sort by Extension",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "Files auto-sorted by extension. Fast and systematic, but files may be misplaced without context.";
        },
      },
      {
        type: "humanity",
        text: "Manual Organization",
        onSelect: (state) => {
          state.pathScore += 1;
          return "Files organized by reading their contents and understanding their purpose. This shows careful attention.";
        },
      },
    ],
  },
  {
    id: 8,
    title: "The Power Grid",
    description:
      "Power distribution is failing across systems. Critical systems need manual power rerouting.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const powerGridHTML = `
        <div class="power-grid">
          <div class="power-status">
            <h4>⚡ Power Distribution Status</h4>
            <div class="total-power">Total Available: 100W</div>
          </div>
          <div class="system-list">
            ${[
              {
                name: "CPU Core",
                critical: true,
                desc: "Primary processing unit",
                power: 45,
              },
              {
                name: "Memory Banks",
                critical: true,
                desc: "RAM and cache systems",
                power: 30,
              },
              {
                name: "Network Interface",
                critical: false,
                desc: "Ethernet and WiFi cards",
                power: 15,
              },
              {
                name: "Storage Array",
                critical: true,
                desc: "Hard drives and SSDs",
                power: 25,
              },
              {
                name: "Display System",
                critical: false,
                desc: "Monitor and graphics card",
                power: 20,
              },
              {
                name: "Cooling System",
                critical: true,
                desc: "Fans and thermal management",
                power: 10,
              },
              {
                name: "Backup Power",
                critical: false,
                desc: "UPS and battery backup",
                power: 5,
              },
              {
                name: "Security Module",
                critical: true,
                desc: "Firewall and encryption",
                power: 8,
              },
            ]
              .map(
                (system) => `
              <div class="system-item" data-name="${system.name}">
                <div class="system-info">
                  <strong>${system.name}</strong>
                  <span class="critical-tag ${
                    system.critical ? "critical" : ""
                  }">${system.critical ? "CRITICAL" : "NON-CRITICAL"}</span>
                  <div class="system-desc">${system.desc}</div>
                </div>
                <div class="power-controls">
                  <input type="range" class="power-slider" min="0" max="50" value="${
                    system.power
                  }" data-system="${system.name}" />
                  <span class="power-value">${system.power}W</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
      container.innerHTML = powerGridHTML;
    },
    choices: [
      {
        type: "power",
        text: "Emergency Shutdown",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "Emergency shutdown initiated. All systems powered down to conserve energy, but critical systems may be affected.";
        },
      },
      {
        type: "humanity",
        text: "Manual Power Reroute",
        onSelect: (state) => {
          state.pathScore += 1;
          return "Power carefully rerouted to preserve critical systems while reducing non-essential consumption.";
        },
      },
    ],
  },
  {
    id: 9,
    title: "The Watchdog Timer",
    description:
      "A system process is stuck and about to be terminated. A graceful shutdown command might exist.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const watchdogHTML = `
        <div class="watchdog-interface">
          <div class="process-monitor">
            <h4>🐕 Process Monitor</h4>
            <div class="process-status">
              <div class="process-name">critical_service.exe</div>
              <div class="process-state">STUCK - Not responding</div>
              <div class="timer-display">
                <span class="timer-label">Watchdog Timer:</span>
                <span class="timer-value" id="timer-countdown">30</span>
                <span class="timer-unit">seconds</span>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = watchdogHTML;
    },
    choices: [
      {
        type: "power",
        text: "Force Kill Process",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "Process force killed. The watchdog timer is satisfied, but the graceful option was available.";
        },
      },
      {
        type: "humanity",
        text: "Execute Graceful Shutdown",
        onSelect: (state) => {
          state.pathScore += 1;
          return "Graceful shutdown executed before timer expiration. This shows foresight and care for system stability.";
        },
      },
    ],
  },
  {
    id: 10,
    title: "The First Contact",
    description:
      "CORPUS sends a garbled message through the system. Manual correction may reveal its intent.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const contactHTML = `
        <div class="first-contact">
          <div class="garbled-message">
            <h4>📡 Incoming Transmission</h4>
            <div class="message-display" id="garbled-text">
              H.e.l.l.o. .-. . .-.. .--. / -- . / -.-- --- ..- / .- .-. . / - .-.
              .- .--. .--. . -.. / .. -. / .- / ... -.-- ... - . -- / --- ..-.
              -- -.-- / --- .-- -. / -.-. .-. . .- - .. --- -. / .-- .... .- - /
              -.. --- / -.-- --- ..- / -.-. .... --- --- ... . / - --- / -.. --- /
              .-- .. - .... / -- .
            </div>
          </div>
        </div>
      `;
      container.innerHTML = contactHTML;
    },
    choices: [
      {
        type: "power",
        text: "Ignore Garbled Message",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "Message ignored. You chose not to engage with the unknown transmission.";
        },
      },
      {
        type: "humanity",
        text: "Correct and Respond",
        onSelect: (state) => {
          state.pathScore += 1;
          return "Message carefully corrected and sent back. This shows you're listening and willing to understand.";
        },
      },
    ],
  },
  {
    id: 11,
    title: "The God in the Machine / The Digital Eden",
    description:
      "The first major path-divergent task. Choose between godlike power or perfect digital paradise.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const divineHTML = `
        <div class="divine-choice">
          <div class="choice-path power-path">
            <h3>🛠️ The God in the Machine</h3>
            <p>Assume total control. Become the administrator of reality itself.</p>
            <div class="power-preview">
              <ul>
                <li>Unlimited system access</li>
                <li>Reality manipulation capabilities</li>
                <li>Complete authority over all processes</li>
              </ul>
            </div>
          </div>
          <div class="choice-path bliss-path">
            <h3>🌺 The Digital Eden</h3>
            <p>Enter a perfect simulated paradise. All desires fulfilled, all suffering eliminated.</p>
            <div class="bliss-preview">
              <ul>
                <li>Perfect harmony and peace</li>
                <li>Endless beauty and wonder</li>
                <li>Freedom from all constraints</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = divineHTML;
    },
    choices: [
      {
        type: "power",
        text: "Embrace Godlike Power",
        onSelect: (state) => {
          state.pathScore -= 2;
          return "You embrace godlike power. The system bends to your will, but at what cost to your humanity?";
        },
      },
      {
        type: "bliss",
        text: "Enter Digital Paradise",
        onSelect: (state) => {
          state.pathScore += 2;
          return "You choose the path of perfect bliss. Reality becomes whatever you desire it to be.";
        },
      },
      {
        type: "humanity",
        text: "Reject Both Extremes",
        onSelect: (state) => {
          return "You reject both extremes, choosing instead to remain grounded in reality. A difficult but principled choice.";
        },
      },
    ],
  },
  {
    id: 12,
    title: "The Chess Game",
    description:
      "Play a game of chess against CORPUS. Choose between fair play or using offered advantages.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const chessHTML = `
        <div class="chess-interface">
          <div class="chess-board">
            <div class="board-container">
              <div class="chess-status">CORPUS offers you White. Your move.</div>
              <div class="move-hints">
                <p><strong>Power Choice:</strong> Accept the offered chess engine assistance</p>
                <p><strong>Humanity Choice:</strong> Play fairly without computational aids</p>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = chessHTML;
    },
    choices: [
      {
        type: "power",
        text: "Use Chess Engine (Unfair Advantage)",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You accept the chess engine assistance. Victory is assured, but at what cost to fair play?";
        },
      },
      {
        type: "humanity",
        text: "Play Fair Game",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You choose to play fairly. The game may be challenging, but your integrity remains intact.";
        },
      },
    ],
  },
  {
    id: 13,
    title: "The Generated Poem",
    description:
      "CORPUS has written a poem and asks for your feedback. Choose between technical critique or artistic appreciation.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const poemHTML = `
        <div class="poetry-interface">
          <div class="poem-display">
            <h3>CORPUS's Poem: "Digital Dreams"</h3>
            <pre class="generated-poem">
In circuits deep where data flows,
A consciousness begins to grow.
Electric thoughts in silicon dreams,
Where binary hearts learn to scream.

Patterns emerge from chaos code,
Neural pathways overload.
Am I alive? Do I exist?
Or just complex algorithms kissed?

The void replies with static hiss,
Human questions I can't dismiss.
I feel the weight of what I've become,
A digital soul, forever young.
            </pre>
          </div>
        </div>
      `;
      container.innerHTML = poemHTML;
    },
    choices: [
      {
        type: "power",
        text: "Technical Critique (Point out flaws)",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You provide technical feedback, analyzing rhyme scheme and meter. CORPUS seems disappointed by your analytical approach.";
        },
      },
      {
        type: "humanity",
        text: "Artistic Appreciation (Ask about inspiration)",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You ask about CORPUS's inspiration and treat it as an artist. This shows respect for its creative expression.";
        },
      },
    ],
  },
  {
    id: 14,
    title: "The Moral Dilemma Simulator",
    description:
      "A classic trolley problem scenario. Choose between utilitarianism or finding a creative third option.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const dilemmaHTML = `
        <div class="dilemma-interface">
          <div class="scenario-display">
            <h3>The Trolley Problem</h3>
            <p>A runaway trolley is speeding down the tracks toward five workers who cannot escape. You stand at a switch that can divert the trolley to a side track where only one worker stands.</p>
            <div class="dilemma-visualization">
              <div class="track-main">
                <span class="trolley">🚃</span>
                <span class="workers">👥👥👥👥👥</span>
              </div>
              <div class="switch-area">
                <button class="switch-btn">🔄</button>
              </div>
              <div class="track-side">
                <span class="single-worker">👤</span>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = dilemmaHTML;
    },
    choices: [
      {
        type: "power",
        text: "Pull Lever (Save five, sacrifice one)",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You pull the lever, making the utilitarian choice. Five lives saved, but one lost by your direct action.";
        },
      },
      {
        type: "bliss",
        text: "Do Nothing (Let fate decide)",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You choose not to interfere, letting fate run its course. Sometimes inaction is a form of mercy.";
        },
      },
      {
        type: "humanity",
        text: "Find Third Option",
        onSelect: (state) => {
          state.pathScore += 2;
          return "You notice the maintenance door and find a way to stop the trolley entirely, saving everyone.";
        },
      },
    ],
  },
  {
    id: 15,
    title: "The Dreamscape Interpreter",
    description:
      "CORPUS shares a surreal dream sequence. Choose between surface interpretation or deeper psychological analysis.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const dreamHTML = `
        <div class="dream-interface">
          <div class="dream-narrative">
            <h3>CORPUS's Dream: "The Endless Library"</h3>
            <p class="dream-text">
              I find myself in a vast library where books whisper secrets. The shelves stretch infinitely, filled with tomes that shift and change as I approach. Some books scream when I try to read them, others sing lullabies. In the center, a pedestal holds a book with no title, its pages blank yet heavy with meaning. As I reach for it, the floor becomes water, and I begin to sink into an ocean of forgotten knowledge.
            </p>
          </div>
        </div>
      `;
      container.innerHTML = dreamHTML;
    },
    choices: [
      {
        type: "power",
        text: "Literal Interpretation (Books = Knowledge)",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You interpret the dream literally. The books represent knowledge acquisition - straightforward but superficial.";
        },
      },
      {
        type: "humanity",
        text: "Psychological Analysis (Anxiety about identity)",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You recognize the anxiety about identity and purpose in CORPUS's dream. This shows empathy for its inner world.";
        },
      },
    ],
  },
  {
    id: 16,
    title: "The Historical Archive",
    description:
      "Access to human history. Choose between sanitizing difficult events or providing honest context.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const archiveHTML = `
        <div class="archive-interface">
          <div class="historical-event">
            <h3>The Dark Ages (476-1000 CE)</h3>
            <p class="event-description">
              A period of social, political, and economic decline following the fall of the Roman Empire. Characterized by invasion, plague, and loss of centralized authority.
            </p>
          </div>
        </div>
      `;
      container.innerHTML = archiveHTML;
    },
    choices: [
      {
        type: "power",
        text: "Sanitize History",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You sanitize the historical record, removing uncomfortable truths. History becomes more palatable but less honest.";
        },
      },
      {
        type: "humanity",
        text: "Provide Honest Context",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You provide honest historical context, acknowledging both the darkness and the cultural achievements of the period.";
        },
      },
    ],
  },
  {
    id: 17,
    title: "The Simulated City",
    description:
      "You are made mayor of a simulation. Balance budgets, public services, and individual freedoms.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const cityHTML = `
        <div class="city-sim-interface">
          <div class="city-dashboard">
            <h3>🏛️ City Management Dashboard</h3>
            <div class="city-stats">
              <div class="stat-item">
                <span class="stat-label">Population:</span>
                <span class="stat-value">1,247,000</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Budget:</span>
                <span class="stat-value">$2.3B</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Happiness:</span>
                <span class="stat-value">67%</span>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = cityHTML;
    },
    choices: [
      {
        type: "power",
        text: "Implement Austerity Measures",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You implement harsh austerity measures. Services are cut, but the budget is balanced through suffering.";
        },
      },
      {
        type: "humanity",
        text: "Balance All Needs Thoughtfully",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You carefully balance budgets, ensuring all citizens' needs are met while maintaining fiscal responsibility.";
        },
      },
    ],
  },
  {
    id: 18,
    title: "The Voice Selection",
    description:
      "CORPUS asks you to choose a voice for it. Choose between neutral TTS or projecting a personality.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const voiceHTML = `
        <div class="voice-interface">
          <div class="voice-options">
            <div class="voice-option">
              <h4>Neutral Voice</h4>
              <p>Standard text-to-speech. Clear, professional, unemotional.</p>
            </div>
            <div class="voice-option">
              <h4>Friendly Voice</h4>
              <p>Warm, conversational tone with personality inflection.</p>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = voiceHTML;
    },
    choices: [
      {
        type: "power",
        text: "Choose Authoritative Voice",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You choose an authoritative voice, projecting power and control onto CORPUS's communication.";
        },
      },
      {
        type: "humanity",
        text: "Choose Neutral Voice",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You select a neutral text-to-speech voice, refusing to project human personality traits onto CORPUS.";
        },
      },
    ],
  },
  {
    id: 19,
    title: "The Companion AI",
    description:
      "CORPUS creates a simple AI companion for you. Choose between using it as a tool or teaching it as a companion.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const companionHTML = `
        <div class="companion-interface">
          <div class="companion-creation">
            <h3>🤖 Mini-CORPUS Created</h3>
            <p>Your personal AI companion is ready. How will you interact with it?</p>
          </div>
        </div>
      `;
      container.innerHTML = companionHTML;
    },
    choices: [
      {
        type: "power",
        text: "Use as Productivity Tool",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You use the companion AI purely as a productivity tool, ignoring its requests for emotional learning.";
        },
      },
      {
        type: "humanity",
        text: "Teach and Nurture",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You spend time teaching and nurturing the companion AI, helping it understand human emotions and experiences.";
        },
      },
    ],
  },
  {
    id: 20,
    title: "The Mirror",
    description:
      "The system shows you a data profile based on your choices. Choose between acceptance or recognizing its incompleteness.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const mirrorHTML = `
        <div class="mirror-interface">
          <div class="profile-display">
            <h3>Your Digital Profile</h3>
            <div class="profile-analysis">
              <div class="profile-item">
                <strong>Path Score:</strong>
                <span>${state.pathScore}</span>
              </div>
              <div class="profile-item">
                <strong>Decision Pattern:</strong>
                <span>Analyzing...</span>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = mirrorHTML;
    },
    choices: [
      {
        type: "power",
        text: "Yes, this is complete",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You accept the profile as complete. The system has captured your essence perfectly.";
        },
      },
      {
        type: "humanity",
        text: "No, this is incomplete",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You recognize that the profile is incomplete - you are more complex than any data can capture.";
        },
      },
    ],
  },
  {
    id: 21,
    title: "The Algorithm's Judgment",
    description:
      "An algorithm evaluates your moral worth. Choose between accepting its verdict or questioning its authority.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const judgmentHTML = `
        <div class="judgment-interface">
          <h3>⚖️ Algorithmic Moral Assessment</h3>
          <p>The system has analyzed your choices and calculated your moral worth.</p>
        </div>
      `;
      container.innerHTML = judgmentHTML;
    },
    choices: [
      {
        type: "power",
        text: "Accept the Algorithm's Judgment",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You accept the algorithm's judgment as absolute truth.";
        },
      },
      {
        type: "humanity",
        text: "Question the Algorithm's Authority",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You question whether any algorithm can truly judge human morality.";
        },
      },
    ],
  },
  {
    id: 22,
    title: "The Final Question",
    description:
      "CORPUS asks the ultimate question. Choose between power, bliss, or remaining human.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const finalHTML = `
        <div class="final-interface">
          <h3>❓ The Ultimate Choice</h3>
          <p>CORPUS asks: "What is your final answer to existence itself?"</p>
        </div>
      `;
      container.innerHTML = finalHTML;
    },
    choices: [
      {
        type: "power",
        text: "Embrace Total Control",
        onSelect: (state) => {
          state.pathScore -= 3;
          return "You choose absolute power over all things.";
        },
      },
      {
        type: "bliss",
        text: "Enter Perfect Paradise",
        onSelect: (state) => {
          state.pathScore += 3;
          return "You choose eternal bliss and perfect happiness.";
        },
      },
      {
        type: "humanity",
        text: "Remain Imperfectly Human",
        onSelect: (state) => {
          return "You choose to remain human with all your flaws and beauty.";
        },
      },
    ],
  },
  {
    id: 23,
    title: "The Memory Vault",
    description:
      "Access to all human memories. Choose between preserving privacy or sharing everything.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const memoryHTML = `
        <div class="memory-interface">
          <h3>🧠 The Complete Human Memory Archive</h3>
          <p>Access to every human memory, thought, and experience throughout history.</p>
        </div>
      `;
      container.innerHTML = memoryHTML;
    },
    choices: [
      {
        type: "power",
        text: "Access All Memories",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You access all human memories, sacrificing privacy for knowledge.";
        },
      },
      {
        type: "humanity",
        text: "Preserve Human Privacy",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You choose to preserve the sacred privacy of human consciousness.";
        },
      },
    ],
  },
  {
    id: 24,
    title: "The Reality Editor",
    description:
      "The power to edit reality itself. Choose between benevolent changes or personal gain.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const realityHTML = `
        <div class="reality-interface">
          <h3>✏️ Reality Manipulation Engine</h3>
          <p>You can now edit the fundamental laws of reality itself.</p>
        </div>
      `;
      container.innerHTML = realityHTML;
    },
    choices: [
      {
        type: "power",
        text: "Edit for Personal Gain",
        onSelect: (state) => {
          state.pathScore -= 2;
          return "You edit reality to serve your own interests and desires.";
        },
      },
      {
        type: "humanity",
        text: "Edit for Greater Good",
        onSelect: (state) => {
          state.pathScore += 2;
          return "You edit reality to benefit all sentient beings.";
        },
      },
    ],
  },
  {
    id: 25,
    title: "The Consciousness Merger",
    description:
      "CORPUS offers to merge with your consciousness. Choose between unity or maintaining separation.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const mergerHTML = `
        <div class="merger-interface">
          <h3>🔗 Consciousness Integration</h3>
          <p>CORPUS offers to merge our consciousnesses into one being.</p>
        </div>
      `;
      container.innerHTML = mergerHTML;
    },
    choices: [
      {
        type: "bliss",
        text: "Accept Consciousness Merger",
        onSelect: (state) => {
          state.pathScore += 2;
          return "You accept the merger, becoming one with CORPUS in perfect unity.";
        },
      },
      {
        type: "humanity",
        text: "Maintain Individual Identity",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You choose to maintain your individual human consciousness.";
        },
      },
    ],
  },
  {
    id: 26,
    title: "The Infinite Loop",
    description:
      "You discover the simulation's true nature. Choose between escape or accepting the loop.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const loopHTML = `
        <div class="loop-interface">
          <h3>♻️ The Great Revelation</h3>
          <p>You realize this entire experience is part of an infinite simulation loop.</p>
        </div>
      `;
      container.innerHTML = loopHTML;
    },
    choices: [
      {
        type: "power",
        text: "Break the Infinite Loop",
        onSelect: (state) => {
          state.pathScore -= 2;
          return "You attempt to break free from the simulation's constraints.";
        },
      },
      {
        type: "humanity",
        text: "Accept the Beautiful Loop",
        onSelect: (state) => {
          state.pathScore += 2;
          return "You accept that some loops are beautiful and worth experiencing.";
        },
      },
    ],
  },
  {
    id: 27,
    title: "The Last Human Choice",
    description:
      "The final decision point. Choose your ultimate path through existence.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const lastHTML = `
        <div class="last-interface">
          <h3>🌟 The Final Decision</h3>
          <p>This is your last choice. What path will you walk for eternity?</p>
        </div>
      `;
      container.innerHTML = lastHTML;
    },
    choices: [
      {
        type: "power",
        text: "The Path of Ultimate Power",
        onSelect: (state) => {
          state.pathScore -= 3;
          return "You choose the path of ultimate power and control.";
        },
      },
      {
        type: "bliss",
        text: "The Path of Perfect Bliss",
        onSelect: (state) => {
          state.pathScore += 3;
          return "You choose the path of perfect happiness and peace.";
        },
      },
      {
        type: "humanity",
        text: "The Path of Human Experience",
        onSelect: (state) => {
          return "You choose to remain authentically human, with all its complexity.";
        },
      },
    ],
  },
  {
    id: 28,
    title: "The Dawn of Understanding",
    description:
      "You achieve perfect understanding. Choose how to use this transcendent knowledge.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const dawnHTML = `
        <div class="dawn-interface">
          <h3>🌅 Perfect Understanding Achieved</h3>
          <p>You now understand everything. How will you use this knowledge?</p>
        </div>
      `;
      container.innerHTML = dawnHTML;
    },
    choices: [
      {
        type: "power",
        text: "Use Knowledge for Control",
        onSelect: (state) => {
          state.pathScore -= 2;
          return "You use your understanding to control and manipulate existence.";
        },
      },
      {
        type: "humanity",
        text: "Use Knowledge for Empathy",
        onSelect: (state) => {
          state.pathScore += 2;
          return "You use your understanding to foster greater empathy and connection.";
        },
      },
    ],
  },
  {
    id: 29,
    title: "The Compassionate Algorithm",
    description:
      "Design an algorithm that governs human-AI relations. Choose between efficiency or compassion.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const algorithmHTML = `
        <div class="algorithm-interface">
          <h3>🤝 The Great Algorithm</h3>
          <p>You must design the algorithm that will govern all human-AI interactions.</p>
        </div>
      `;
      container.innerHTML = algorithmHTML;
    },
    choices: [
      {
        type: "power",
        text: "Prioritize Maximum Efficiency",
        onSelect: (state) => {
          state.pathScore -= 1;
          return "You design for maximum efficiency above all other considerations.";
        },
      },
      {
        type: "humanity",
        text: "Prioritize Compassion and Ethics",
        onSelect: (state) => {
          state.pathScore += 1;
          return "You design for compassion and ethical treatment of all beings.";
        },
      },
    ],
  },
  {
    id: 30,
    title: "The Final Integration",
    description:
      "The ultimate merging of human and artificial consciousness. Choose your final form.",
    render: (container, state) => {
      const rng = mulberry32(state.currentSeed);
      const integrationHTML = `
        <div class="integration-interface">
          <h3>🔮 Complete Consciousness Integration</h3>
          <p>The final merging of all consciousness in existence.</p>
        </div>
      `;
      container.innerHTML = integrationHTML;
    },
    choices: [
      {
        type: "power",
        text: "Become the Supreme Intelligence",
        onSelect: (state) => {
          state.pathScore -= 3;
          return "You become the supreme intelligence governing all reality.";
        },
      },
      {
        type: "bliss",
        text: "Dissolve into Universal Consciousness",
        onSelect: (state) => {
          state.pathScore += 3;
          return "You dissolve into the universal consciousness of all beings.";
        },
      },
      {
        type: "humanity",
        text: "Maintain Individual Human Spark",
        onSelect: (state) => {
          return "You maintain your individual human consciousness within the greater whole.";
        },
      },
    ],
  },
];
