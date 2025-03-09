// Fetch match results and display them in the table
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
                competition:competition_id (name),
                venue:venue_id (name),
                match_notes
            `)
            .order("date", { ascending: false });

        if (error) throw error;

        console.log("✅ Matches fetched:", data);
        displayMatches(data);
    } catch (error) {
        console.error("❌ Error fetching matches:", error);
    }
}

// Display match results in the table
function displayMatches(results) {
    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) return console.error("❌ Error: resultsTableBody not found.");

    tbody.innerHTML = results.map(match => {
        return `
            <tr class="match-row" data-match-id="${match.id}">
                <td>${match.date}</td>
                <td>${match.home_team?.name || "Unknown Team"}</td>
                <td class="score-column">
                    <span class="score-badge win-score">${match.home_score}</span> - 
                    <span class="score-badge loss-score">${match.away_score}</span>
                </td>
                <td>${match.away_team?.name || "Unknown Team"}</td>
                <td>${match.competition?.name || "Unknown Competition"}</td>
                <td><span class="expand-indicator">⬇</span> ${match.venue?.name || "Unknown Venue"}</td>
            </tr>
            <tr class="match-details" id="match-details-${match.id}">
                <td colspan="6"><p>Match Details</p></td>
            </tr>
        `;
    }).join('');
}

// Run fetchMatches() on page load
document.addEventListener("DOMContentLoaded", fetchMatches);
