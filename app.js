async function loadMatches() {

const today = new Date().toLocaleDateString("it-IT");

let data;

const savedDate = localStorage.getItem("savedDate");
const savedData = localStorage.getItem("savedData");

localStorage.clear();

if (savedDate === today && savedData) {

data = JSON.parse(savedData);

} else {

const res = await fetch("/.netlify/functions/matches");
data = await res.json();
localStorage.setItem("savedDate", today);
localStorage.setItem("savedData", JSON.stringify(data));
}
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
 
  <div style="margin-top:12px">

  <div style="font-weight:bold;color:#fff;">
    ${match.status}
  </div>

  ${match.result ? `
    <div style="margin-top:6px;color:#7ee787;">
      ${match.result}
    </div>
  ` : ""}

  ${
    match.htHome !== null
      ? `
      <div style="margin-top:6px;color:#bbb;">
        HT: ${match.htHome}-${match.htAway}
      </div>
      `
      : ""
  }

      </div>

   </div>
   `;
});
}

loadMatches();

const oggi = new Date();
document.getElementById("data").innerHTML =
  "Aggiornato: " + oggi.toLocaleDateString("it-IT");
