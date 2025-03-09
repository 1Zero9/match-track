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

// Display match results
function displayMatches(results) {
    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) return console.error("❌ Error: resultsTableBody not found.");

    tbody.innerHTML = results.map(match => {
        return `
            <tr class="match-row" data-match-id="${match.id}">
                <td>${match.date}</td>
                <td>${match.home_team?.name || "Unknown Team"}</td>
                <td class="score-column">${match.home_score} - ${match.away_score}</td>
                <td>${match.away_team?.name || "Unknown Team"}</td>
                <td>${match.competition?.name || "Unknown Competition"}</td>
                <td>${match.venue?.name || "Unknown Venue"} 
                    <span class="expand-indicator">⬇</span>
                </td>
            </tr>
            <tr class="match-details hidden" id="match-details-${match.id}">
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
    }).join('');

    document.querySelectorAll(".match-row").forEach(row => {
        row.addEventListener("click", function () {
            const matchId = this.dataset.matchId;
            const detailsRow = document.getElementById(`match-details-${matchId}`);
            detailsRow.classList.toggle("show");

            const arrow = this.querySelector(".expand-indicator");
            arrow.textContent = detailsRow.classList.contains("show") ? "⬆" : "⬇";
        });
    });
}

// Run fetchMatches() on page load
document.addEventListener("DOMContentLoaded", fetchMatches);
