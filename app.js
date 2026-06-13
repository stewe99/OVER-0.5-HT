const matches = [
  {
    score: 98,
    home: "Malmo FF",
    away: "Hammarby"
  },
  {
    score: 95,
    home: "Bodo/Glimt",
    away: "Molde"
  },
  {
    score: 94,
    home: "PSV",
    away: "Utrecht"
  }
];

const container = document.getElementById("matches");

matches.forEach(match => {
  container.innerHTML += `
    <div class="card">
      <div class="score">${match.score}%</div>
      <div class="match">
        ${match.home}<br>
        vs<br>
        ${match.away}
      </div>
      <div class="badge">🔥 TOP PICK</div>
    </div>
  `;
});
