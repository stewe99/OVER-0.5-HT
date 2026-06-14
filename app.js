async function loadMatches() {
  const res = await fetch("/.netlify/functions/matches");
  const data = await res.json();
  document.getElementById("api-counter").innerHTML =
   `API usate oggi: ${data.apiUsed}`;
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

      <div style="margin-top:10px;font-size:15px;color:#bbb;">
         🕒 ${match.kickoff}
      </div>

      <div style="margin-top:6px;font-size:14px;color:#888;">
         ${match.league}
      </div>

      <div class="badge">${match.badge}</div>

   </div>
   `;
});
}

loadMatches();

const oggi = new Date();
document.getElementById("data").innerHTML =
  "Aggiornato: " + oggi.toLocaleDateString("it-IT");
