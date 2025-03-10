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

    // Ensure the match rows contain the + icon for toggling reports
    // The reports will expand inline without breaking row formatting
            const tbody = document.getElementById("resultsTableBody");
    if (!tbody) return console.error("❌ Error: resultsTableBody not found.");

    tbody.innerHTML = results.map(match => {

        const hasReport = match.match_notes && match.match_notes.trim() !== "";
        const toggleClass = hasReport ? "active" : "inactive";
                let homeScoreClass, awayScoreClass;

        // Determine correct score colours
        if (match.home_score > match.away_score) {
            homeScoreClass = "win-score";
            awayScoreClass = "loss-score";
        } else if (match.home_score < match.away_score) {
            homeScoreClass = "loss-score";
            awayScoreClass = "win-score";
        } else {
            homeScoreClass = "draw-score";
            awayScoreClass = "draw-score";
        }

        return `
            <tr class="match-row" data-match-id="${match.id}">
                <td>${match.date}</td>
                <td>${match.home_team?.name || "Unknown Team"}</td>
                <td class="score-column">
                    <span class="score-badge ${homeScoreClass}">${match.home_score}</span> - 
                    <span class="score-badge ${awayScoreClass}">${match.away_score}</span>
                </td>
                <td>${match.away_team?.name || "Unknown Team"}</td>
                <td>${match.competition?.name || "Unknown Competition"}</td>
                <td>${match.venue?.name || "Unknown Venue"}</td>

                <td>
                    <button class="toggle-report ${toggleClass}" data-match-id="${match.id}" aria-label="View Match Report">
                        ➕
                    </button>
                </td>
                    </tr>
            <tr class="match-details hidden" id="match-details-${match.id}">
                <td colspan="7">
                    <div class="match-stats">
                        <h3>Match Report</h3>
                        <p><strong>Competition:</strong> ${match.competition?.name || "N/A"}</p>
                        <p><strong>Venue:</strong> ${match.venue?.name || "N/A"}</p>
                        <p><strong>Match Notes:</strong> ${match.match_notes || "No additional details yet."}</p>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Add event listeners for toggling match details
    document.querySelectorAll(".match-toggle").forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent row click interference
            const row = this.closest("tr");
            const matchId = row.dataset.matchId;
            const detailsRow = document.getElementById(`match-details-${matchId}`);

            // Close other open match details
            document.querySelectorAll(".match-details").forEach(detail => {
                if (detail !== detailsRow) {
                    detail.classList.remove("show");
                }
            });

            // Toggle match details visibility
            detailsRow.classList.toggle("show");

            // Highlight selected row
            document.querySelectorAll(".match-row").forEach(r => r.classList.remove("selected"));
            if (detailsRow.classList.contains("show")) {
                row.classList.add("selected");
            } else {
                row.classList.remove("selected");
            }

            // Toggle button text (+/-)
            this.textContent = detailsRow.classList.contains("show") ? "−" : "+";
        });
    });

    // Hide match details when clicking outside
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".match-row") && !event.target.closest(".match-details")) {
            document.querySelectorAll(".match-details").forEach(detail => detail.classList.remove("show"));
            document.querySelectorAll(".match-toggle").forEach(button => button.textContent = "+");
            document.querySelectorAll(".match-row").forEach(row => row.classList.remove("selected"));
        }
    });
}

// Run fetchMatches() on page load
document.addEventListener("DOMContentLoaded", fetchMatches);
