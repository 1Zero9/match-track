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
                venue:venue_id (name)
            `)
            .order("date", { ascending: false });

        if (error) throw error;

        console.log("✅ Matches fetched:", data);
        displayMatches(data);
    } catch (error) {
        console.error("❌ Error fetching matches:", error);
    }
}

// Display match results in the table with result indicators
function displayMatches(results) {
    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) return console.error("❌ Error: resultsTableBody not found.");

    tbody.innerHTML = results.length
        ? results.map(match => {
            const matchDate = new Date(match.date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            });

            let resultIndicator = '';

            if (match.home_score > match.away_score) {
                resultIndicator = `<span class="result-indicator win-indicator">✔</span>`;
            } else if (match.home_score < match.away_score) {
                resultIndicator = `<span class="result-indicator loss-indicator">✘</span>`;
            } else {
                resultIndicator = `<span class="result-indicator draw-indicator">≡</span>`;
            }

            return `
                <tr>
                    <td>${matchDate}</td>
                    <td>${match.home_team?.name || "Unknown Team"}</td>
                    <td class="score-column">${match.home_score} - ${match.away_score}</td>
                    <td>${match.away_team?.name || "Unknown Team"}</td>
                    <td>${match.competition?.name || "Unknown Competition"}</td>
                    <td>${match.venue?.name || "Unknown Venue"}</td>
                    <td>${resultIndicator}</td>
                </tr>
            `;
        }).join('')
        : `<tr><td colspan="7" style="text-align: center;">No matches found</td></tr>`;
}
