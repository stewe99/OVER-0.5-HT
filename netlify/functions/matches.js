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
.filter(match => match.fixture.status.short === "NS")
.slice(0, 20)
.map(match => ({
    home: match.teams.home.name,
    away: match.teams.away.name,

    kickoff: new Date(match.fixture.date)
      .toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit"
      }),

    league: match.league.name,

    score: 50
}));

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