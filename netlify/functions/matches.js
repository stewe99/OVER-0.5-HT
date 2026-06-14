exports.handler = async function () {
  const apiKey = process.env.API_FOOTBALL_KEY;
console.log("API KEY PRESENTE:", !!apiKey);
  try {
    const today = new Date().toISOString().split("T")[0];

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}`,
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    const data = await response.json();
    console.log(JSON.stringify(data));

    const matches = data.response
.filter(match =>
  match.fixture.status.short === "NS" &&
  (
    match.league.country === "USA" ||
    match.league.country === "Norway" ||
    match.league.country === "Sweden" ||
    match.league.country === "Denmark" ||
    match.league.country === "Finland"
  )
)
.sort((a, b) => {

const scoreA =
a.league.country === "Norway" ? 84 :
a.league.country === "Sweden" ? 82 :
a.league.country === "Denmark" ? 81 :
a.league.country === "Finland" ? 79 :
a.league.country === "USA" ? 78 :
75;

const scoreB =
b.league.country === "Norway" ? 84 :
b.league.country === "Sweden" ? 82 :
b.league.country === "Denmark" ? 81 :
b.league.country === "Finland" ? 79 :
b.league.country === "USA" ? 78 :
75;

return scoreB - scoreA;

})
.slice(0,15)

.map(match => {

  const htGoals =
    (match.score?.halftime?.home || 0) +
    (match.score?.halftime?.away || 0);

  const ftGoals =
    (match.goals?.home || 0) +
    (match.goals?.away || 0);

  let status = "⏳ DA GIOCARE";
  let result = "";
  let recovery = false;

  if (match.fixture.status.short === "HT") {

    if (htGoals > 0) {
      status = "✅ WIN HT";
      result = "OVER 0.5 HT PRESO";
    } else {
      status = "❌ LOSE HT";
      result = "0-0 HT";
      recovery = true;
    }

  }

  if (match.fixture.status.short === "FT") {

    if (htGoals > 0) {
      status = "✅ WIN HT";
      result = "OVER 0.5 HT PRESO";
    } else {

      if (ftGoals >= 2) {
        status = "🔄 RECUPERO PRESO";
        result = "OVER 1.5 FT WIN";
        recovery = true;
      } else {
        status = "❌ RECUPERO PERSO";
        result = "OVER 1.5 FT LOSE";
        recovery = true;
      }

    }

  }

  return {
    home: match.teams.home.name,
    away: match.teams.away.name,

    kickoff: new Date(match.fixture.date)
      .toLocaleTimeString("it-IT", {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit"
      }),

    league: match.league.name,

    status,
    result,
    recovery,

    htHome: match.score?.halftime?.home ?? null,
    htAway: match.score?.halftime?.away ?? null,

    score:
      match.league.country === "Norway" ? 84 :
      match.league.country === "Sweden" ? 82 :
      match.league.country === "Denmark" ? 81 :
      match.league.country === "Finland" ? 79 :
      match.league.country === "USA" ? 78 :
      75,

badge:
match.league.country === "Norway" ? "🔥 TOP PICK" :
match.league.country === "Sweden" ? "⭐ VALUE" :
match.league.country === "Denmark" ? "💎 PREMIUM" :
match.league.country === "Finland" ? "✅ GOOD" :
"📈 PICK"
};

})

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: today,
        apiUsed: 1,
        matches
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};