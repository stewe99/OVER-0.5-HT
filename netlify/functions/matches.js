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

    const matches = data.response.slice(0, 20).map(match => ({
      home: match.teams.home.name,
      away: match.teams.away.name,
      score: Math.floor(Math.random() * 11) + 90
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: today,
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