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
                <td><button class="match-toggle" onclick="toggleMatchDetails(this)">+</button></td>
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
                this.textContent = "−"; // Set toggle to minus
            } else {
                row.classList.remove("selected");
                this.textContent = "+"; // Set toggle back to plus
            }
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
/* MATCH TOGGLE BUTTON */
.match-toggle {
    cursor: pointer;
    font-size: 22px; /* Bigger */
    font-weight: bold;
    background: none;
    border: none;
    color: var(--accent-color);
    transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;
    width: 40px;
}

/* Pulsing animation on + button */
.match-toggle:hover {
    color: var(--accent-hover);
    transform: scale(1.2);
}

/* MATCH ROW HIGHLIGHT WHEN SELECTED */
.match-row.selected {
    background-color: rgba(38, 166, 154, 0.3); /* Subtle highlight */
    transition: background-color 0.3s ease-in-out;
}

/* MATCH DETAILS CARD */
.match-details {
    display: none;
    background-color: white;
    border-radius: 12px;
    padding: 15px;
    width: 90%;
    max-width: 750px;
    margin: auto;
    border-left: 6px solid var(--accent-color);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transform: scale(0.95);
    opacity: 0;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.match-details.show {
    display: block;
    transform: scale(1);
    opacity: 1;
}
