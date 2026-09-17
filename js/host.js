// Phase 1: ระบบ Host แบบ Demo
// ข้อมูลจะอยู่ในหน่วยความจำของหน้าเว็บเท่านั้น
// Phase 2 จะเชื่อม Firebase เพื่อให้ผู้เล่นทุกคนเห็นข้อมูลเดียวกัน

const state = {
  tripCode: "DEMO01",
  players: [
    { id: "p1", name: "ตัง", totalScore: 125 },
    { id: "p2", name: "กัน", totalScore: 90 },
    { id: "p3", name: "อ้วน", totalScore: 75 },
    { id: "p4", name: "ตอง", totalScore: 40 },
    { id: "p5", name: "เอิท", totalScore: 20 },
    { id: "p6", name: "อิ้ง", totalScore: 5 }
  ],
  games: [],
  currentGame: null
};

const quickScores = [-10, -5, -1, 1, 5, 10];

function formatScore(score) {
  return score > 0 ? `+${score}` : `${score}`;
}

function renderPlayers() {
  const container = document.getElementById("players");

  container.innerHTML = state.players.map(player => `
    <div class="player-card">
      <div class="player-info">
        <strong>${player.name}</strong>
        <div class="player-total">
          คะแนนรวม: ${formatScore(player.totalScore)}
        </div>
      </div>
      <div class="player-buttons">
        ${quickScores.map(value => `
          <button class="score-btn" onclick="addScore('${player.id}', ${value})">
            ${formatScore(value)}
          </button>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function renderCurrentGame() {
  const container = document.getElementById("scoreControls");
  const title = document.getElementById("currentGameName");

  if (!state.currentGame) {
    title.textContent = "ยังไม่มีเกม";
    container.innerHTML = `
      <div class="empty-state">
        กด “+ เพิ่มเกม” เพื่อเริ่มเกมแรก
      </div>
    `;
    return;
  }

  title.textContent = state.currentGame.name;

  container.innerHTML = `
    ${state.players.map(player => {
      const score = state.currentGame.scores[player.id] || 0;

      return `
        <div class="game-player-row">
          <div>
            <strong>${player.name}</strong>
            <div class="current-score">
              คะแนนเกมนี้: ${formatScore(score)}
            </div>
          </div>

          <div class="player-buttons">
            ${quickScores.map(value => `
              <button class="score-btn"
                onclick="addGameScore('${player.id}', ${value})">
                ${formatScore(value)}
              </button>
            `).join("")}

            <button class="score-btn custom"
              onclick="customGameScore('${player.id}')">
              กำหนดเอง
            </button>
          </div>
        </div>
      `;
    }).join("")}

    <div class="game-actions">
      <button class="btn primary" onclick="finishGame()">✓ จบเกม</button>
    </div>
  `;
}

function renderGameHistory() {
  const container = document.getElementById("gameHistory");

  if (!state.games.length) {
    container.innerHTML = `<div class="empty-state">ยังไม่มีเกมที่จบแล้ว</div>`;
    return;
  }

  container.innerHTML = [...state.games].reverse().map((game, index) => `
    <div class="history-item">
      <div class="history-title">${game.name}</div>
      <div class="history-meta">
        ${game.totalChanges} รายการเปลี่ยนคะแนน · จบแล้ว
      </div>
    </div>
  `).join("");
}

function addScore(playerId, value) {
  const player = state.players.find(item => item.id === playerId);
  if (!player) return;

  player.totalScore += value;
  renderPlayers();
}

function addGameScore(playerId, value) {
  if (!state.currentGame) return;

  state.currentGame.scores[playerId] =
    (state.currentGame.scores[playerId] || 0) + value;

  state.currentGame.totalChanges += 1;

  renderCurrentGame();
}

function customGameScore(playerId) {
  if (!state.currentGame) return;

  const player = state.players.find(item => item.id === playerId);
  const input = prompt(`ใส่คะแนนของ ${player.name}
ตัวอย่าง: 20 หรือ -10`);

  if (input === null || input.trim() === "") return;

  const value = Number(input);

  if (!Number.isFinite(value)) {
    alert("กรุณาใส่ตัวเลขเท่านั้น");
    return;
  }

  addGameScore(playerId, value);
}

function addPlayer() {
  const name = prompt("ชื่อผู้เล่น");

  if (!name || !name.trim()) return;

  state.players.push({
    id: `p${Date.now()}`,
    name: name.trim(),
    totalScore: 0
  });

  renderPlayers();
  renderCurrentGame();
}

function addGame() {
  if (state.currentGame) {
    const confirmFinish = confirm(
      "ยังมีเกมที่กำลังเล่นอยู่
ต้องการจบเกมปัจจุบันก่อนหรือไม่?"
    );

    if (confirmFinish) {
      finishGame();
    } else {
      return;
    }
  }

  const name = prompt("ชื่อเกม");

  if (!name || !name.trim()) return;

  state.currentGame = {
    id: `g${Date.now()}`,
    name: name.trim(),
    scores: {},
    totalChanges: 0
  };

  renderCurrentGame();
}

function finishGame() {
  if (!state.currentGame) return;

  const confirmed = confirm(
    `จบเกม "${state.currentGame.name}" ใช่หรือไม่?`
  );

  if (!confirmed) return;

  // นำคะแนนของเกมปัจจุบันไปบวกเข้าคะแนนรวม
  state.players.forEach(player => {
    const gameScore = state.currentGame.scores[player.id] || 0;
    player.totalScore += gameScore;
  });

  state.games.push({
    ...state.currentGame
  });

  state.currentGame = null;

  renderPlayers();
  renderCurrentGame();
  renderGameHistory();
}

function init() {
  document.getElementById("tripCode").textContent = state.tripCode;

  document
    .getElementById("addPlayerBtn")
    .addEventListener("click", addPlayer);

  document
    .getElementById("addGameBtn")
    .addEventListener("click", addGame);

  renderPlayers();
  renderCurrentGame();
  renderGameHistory();
}

init();
