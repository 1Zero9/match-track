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

/* Filter Container Fixes */
.filter-container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 1100px;
    margin: 20px auto;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-end;
}

.filter-group {
    flex: 1 1 200px;
    min-width: 150px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Results Table Container Fixes */
.table-container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 1100px;
    margin: 20px auto;
    color: var(--text-dark);
}

/* Table Row Color Fix */
.results-table td {
    background-color: white;
    color: var(--text-dark);
    padding: 12px 10px;
    font-size: 14px;
    border-bottom: 1px solid var(--border-color);
}

/* Match Details Row Fix */
.match-details {
    background-color: var(--secondary-bg-color);
    color: var(--text-dark);
}

.match-details.hidden {
    display: none;
}

.match-details.show {
    display: table-row;
}
