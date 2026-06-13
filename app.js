async function loadMatches() {
  const res = await fetch("/.netlify/functions/matches");
  const data = await res.json();
  const matches = data.matches;

  const container = document.getElementById("matches");
  container.innerHTML = "";

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
}

loadMatches();

const oggi = new Date();
document.getElementById("data").innerHTML =
  "Aggiornato: " + oggi.toLocaleDateString("it-IT");
