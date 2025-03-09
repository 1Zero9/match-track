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

// Display match results in the table with expandable details
function displayMatches(results) {
    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) return console.error("❌ Error: resultsTableBody not found.");

    tbody.innerHTML = results.length
        ? results.map(match => {
            const matchDate = new Date(match.date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
            });

            let matchClass = 'draw-match';
            if (match.home_score > match.away_score) matchClass = 'win-match';
            if (match.home_score < match.away_score) matchClass = 'loss-match';

            let homeScoreClass = match.home_score > match.away_score ? 'win-score' : 
                                 match.home_score < match.away_score ? 'loss-score' : 'draw-score';

            let awayScoreClass = match.away_score > match.home_score ? 'win-score' : 
                                 match.away_score < match.home_score ? 'loss-score' : 'draw-score';

            return `
                <tr class="match-row" data-match-id="${match.id}">
                    <td>${matchDate}</td>
                    <td>${match.home_team?.name || "Unknown Team"}</td>
                    <td class="score-column">
                        <span class="score-badge ${homeScoreClass}">${match.home_score}</span> - 
                        <span class="score-badge ${awayScoreClass}">${match.away_score}</span>
                    </td>
                    <td>${match.away_team?.name || "Unknown Team"}</td>
                    <td>${match.competition?.name || "Unknown Competition"}</td>
                    <td>${match.venue?.name || "Unknown Venue"}</td>
                </tr>
                <tr class="match-details hidden ${matchClass}" id="match-details-${match.id}">
                    <td colspan="6">
                        <div class="match-stats">
                            <h3>Match Details</h3>
                            <p><strong>Competition:</strong> ${match.competition?.name || "N/A"}</p>
                            <p><strong>Venue:</strong> ${match.venue?.name || "N/A"}</p>
                            <p><strong>Match Notes:</strong> ${match.match_notes || "No additional details yet."}</p>
                        </div>
                    </td>
                </tr>
            `;
        }).join('')
        : `<tr><td colspan="6" style="text-align: center;">No matches found</td></tr>`;

    // Attach click events to each match row
    document.querySelectorAll(".match-row").forEach(row => {
        row.addEventListener("click", function () {
            const matchId = this.dataset.matchId;
            const detailsRow = document.getElementById(`match-details-${matchId}`);

            // Highlight the selected row
            document.querySelectorAll(".match-row").forEach(r => r.classList.remove("selected"));
            this.classList.add("selected");

            detailsRow.classList.toggle("hidden");
        });
    });
}

// Run fetchMatches() on page load
document.addEventListener("DOMContentLoaded", fetchMatches);
