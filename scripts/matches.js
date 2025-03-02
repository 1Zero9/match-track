// ✅ Fetch match results and display them in the table
async function fetchMatches() {
    console.log("📊 Fetching match results...");

    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) {
        console.warn("⚠ No results table found. Skipping fetch.");
        return;
    }

    try {
        const { data, error } = await supabase
            .from("matches")
            .select(`
                id, date, home_score, away_score,
                home_team:home_team_id (name),
                away_team:away_team_id (name),
                competition:competition_id (name)
            `)
            .order("date", { ascending: false });

        if (error) throw error;

        console.log("✅ Matches fetched:", data);
        displayMatches(data);
    } catch (error) {
        console.error("❌ Error fetching matches:", error);
    }
}

// ✅ Display match results in the table
function displayMatches(results) {
    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) return console.error("❌ Error: resultsTableBody not found.");

    tbody.innerHTML = results.length
        ? results.map(match => `
            <tr>
                <td>${new Date(match.date).toLocaleDateString()}</td>
                <td>${match.home_team?.name || "Unknown Team"}</td>
                <td>${match.home_score} - ${match.away_score}</td>
                <td>${match.away_team?.name || "Unknown Team"}</td>
                <td>${match.competition?.name || "Unknown Competition"}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="5" style="text-align: center;">No matches found</td></tr>`;
}

// ✅ Handle inserting a new match from admin.html
async function addMatch(event) {
    event.preventDefault();

    const matchDate = document.getElementById("match-date").value;
    const homeTeam = document.getElementById("home-team").value;
    const awayTeam = document.getElementById("away-team").value;
    const homeScore = document.getElementById("home-score").value;
    const awayScore = document.getElementById("away-score").value;
    const competition = document.getElementById("competition").value;

    try {
        const [homeTeamData, awayTeamData, competitionData] = await Promise.all([
            getEntityId("teams", homeTeam),
            getEntityId("teams", awayTeam),
            getEntityId("competitions", competition)
        ]);

        if (!homeTeamData || !awayTeamData || !competitionData) {
            console.error("❌ Error fetching necessary IDs.");
            return;
        }

        const { error } = await supabase.from("matches").insert([
            {
                date: matchDate,
                home_team_id: homeTeamData.id,
                away_team_id: awayTeamData.id,
                home_score: homeScore,
                away_score: awayScore,
                competition_id: competitionData.id
            }
        ]);

        if (error) throw error;

        console.log("✅ Match added successfully!");
        fetchMatches();  // Refresh match list
    } catch (error) {
        console.error("❌ Error adding match:", error);
    }
}

// ✅ Fetch ID of an entity (team, competition)
async function getEntityId(table, name) {
    try {
        const { data, error } = await supabase
            .from(table)
            .select("id")
            .eq("name", name)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`❌ Error fetching ${name} from ${table}:`, error);
        return null;
    }
}
