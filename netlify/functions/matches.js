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
    console.log("RISPOSTA API:", JSON.stringify(data));

    // Controllo di sicurezza se l'API risponde con un errore o dati vuoti
    if (!data.response || !Array.isArray(data.response)) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          apiUsed: 1,
          matches: [],
          errorFromApi: data.errors || "Risposta non valida dall'API"
        })
      };
    }

    const matches = data.response
      .filter(match =>
        match.fixture &&
        match.fixture.status &&
        (
          match.fixture.status.short === "NS" ||
          match.fixture.status.short === "HT" ||
          match.fixture.status.short === "FT"
        ) &&
        match.league &&
        match.league.country &&
        (
          match.league.country === "USA" ||
          match.league.country === "Norway" ||
          match.league.country === "Sweden" ||
          match.league.country === "Denmark" ||
          match.league.country === "Finland" ||
          match.league.country === "Italy" ||
          match.league.country === "England" ||
          match.league.country === "Spain" ||
          match.league.country === "Germany" ||
          match.league.country === "France"
        )
      )
      .sort((a, b) => {
        const getScore = (match) => {
          const c = match.league?.country;
          if (c === "Norway") return 84;
          if (c === "Sweden") return 82;
          if (c === "Denmark") return 81;
          if (c === "Italy" || c === "England") return 80;
          if (c === "Finland") return 79;
          if (c === "USA") return 78;
          if (c === "Spain" || c === "Germany") return 77;
          if (c === "France") return 76;
          return 75;
        };
        return getScore(b) - getScore(a);
      })
      .slice(0, 15)
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

        const c = match.league?.country;

        return {
          home: match.teams?.home?.name || "Home",
          away: match.teams?.away?.name || "Away",
          kickoff: match.fixture?.date ? new Date(match.fixture.date).toLocaleTimeString("it-IT", {
            timeZone: "Europe/Rome",
            hour: "2-digit",
            minute: "2-digit"
          }) : "--:--",
          league: match.league?.name || "League",
          status,
          result,
          recovery,
          htHome: match.score?.halftime?.home ?? null,
          htAway: match.score?.halftime?.away ?? null,
          score: c === "Norway" ? 84 : c === "Sweden" ? 82 : c === "Denmark" ? 81 : 80,
          badge: c === "Norway" ? "🔥 TOP PICK" : c === "Italy" ? "⚽ SERIE A" : "📈 PICK"
        };
      });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: today,
        apiUsed: 1,
        matches
      })
    };
  } catch (error) {
    console.error("ERRORE NELLA FUNZIONE:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
