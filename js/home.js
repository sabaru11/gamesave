// Phase 1: ข้อมูลจำลองสำหรับทดสอบหน้า Home
// Phase 2 จะเปลี่ยนส่วนนี้ให้ดึงข้อมูลจาก Firebase

const demoData = {
  tripCode: "DEMO01",
  players: [
    { id: "p1", name: "ตัง", totalScore: 125 },
    { id: "p2", name: "กัน", totalScore: 90 },
    { id: "p3", name: "อ้วน", totalScore: 75 },
    { id: "p4", name: "ตอง", totalScore: 40 },
    { id: "p5", name: "เอิท", totalScore: 20 },
    { id: "p6", name: "อิ้ง", totalScore: 5 }
  ],
  games: [
    {
      id: "g1",
      name: "ทายเพลง",
      status: "finished",
      scores: [
        { playerId: "p1", name: "ตัง", score: 10 },
        { playerId: "p2", name: "กัน", score: 5 },
        { playerId: "p3", name: "อ้วน", score: -5 }
      ]
    },
    {
      id: "g2",
      name: "เป่ายิ้งฉุบ",
      status: "finished",
      scores: [
        { playerId: "p1", name: "ตัง", score: 20 },
        { playerId: "p4", name: "ตอง", score: 15 },
        { playerId: "p2", name: "กัน", score: -10 }
      ]
    }
  ]
};

function formatScore(score) {
  return score > 0 ? `+${score}` : `${score}`;
}

function renderLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");
  const players = [...demoData.players].sort((a, b) => b.totalScore - a.totalScore);

  document.getElementById("playerCount").textContent = `${players.length} คน`;

  const medals = ["🥇", "🥈", "🥉"];

  leaderboard.innerHTML = players.map((player, index) => `
    <div class="player-row">
      <div class="rank">${medals[index] || index + 1}</div>
      <div class="player-name">${player.name}</div>
      <div class="score ${player.totalScore < 0 ? "negative" : ""}">
        ${formatScore(player.totalScore)}
      </div>
    </div>
  `).join("");
}

function renderLatestGame() {
  const latestGame = document.getElementById("latestGame");
  const game = demoData.games[demoData.games.length - 1];

  if (!game) {
    latestGame.innerHTML = `<div class="empty-state">ยังไม่มีเกม</div>`;
    return;
  }

  latestGame.innerHTML = `
    <div class="game-title">${game.name}</div>
    ${game.scores.map(item => `
      <div class="score-line">
        <span>${item.name}</span>
        <strong>${formatScore(item.score)}</strong>
      </div>
    `).join("")}
  `;
}

function renderGames() {
  const gameList = document.getElementById("gameList");
  document.getElementById("gameCount").textContent = `${demoData.games.length} เกม`;

  if (!demoData.games.length) {
    gameList.innerHTML = `<div class="empty-state">ยังไม่มีเกม</div>`;
    return;
  }

  gameList.innerHTML = [...demoData.games].reverse().map((game, index) => `
    <div class="game-item">
      <div class="game-item-title">เกมที่ ${demoData.games.length - index}: ${game.name}</div>
      <div class="game-item-meta">
        ${game.status === "finished" ? "✓ จบเกม" : "กำลังเล่น"}
      </div>
    </div>
  `).join("");
}

function init() {
  document.getElementById("tripCode").textContent = demoData.tripCode;
  renderLeaderboard();
  renderLatestGame();
  renderGames();
}

init();
