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
            // Format date nicely
            const matchDate = new Date(match.date);
            const formattedDate = matchDate.toLocaleDateString('en-GB', {
                day: 'numeric', 
                month: 'short', 
                year: 'numeric'
            });
            
            // Determine if this is a River Valley Rangers match and get result
            let resultClass = '';
            const isRVRHomeTeam = match.home_team?.name.includes('River Valley') || match.home_team?.name.includes('RVR');
            const isRVRAwayTeam = match.away_team?.name.includes('River Valley') || match.away_team?.name.includes('RVR');
            
            if (isRVRHomeTeam) {
                if (match.home_score > match.away_score) resultClass = 'win';
                else if (match.home_score < match.away_score) resultClass = 'loss';
                else resultClass = 'draw';
            } else if (isRVRAwayTeam) {
                if (match.away_score > match.home_score) resultClass = 'win';
                else if (match.away_score < match.home_score) resultClass = 'loss';
                else resultClass = 'draw';
            }
            
            return `
                <tr class="${resultClass}">
                    <td>${formattedDate}</td>
                    <td>${match.home_team?.name || "Unknown Team"}</td>
                    <td class="score-column">${match.home_score} - ${match.away_score}</td>
                    <td>${match.away_team?.name || "Unknown Team"}</td>
                    <td>${match.competition?.name || "Unknown Competition"}</td>
                    <td>${match.venue?.name || "Unknown Venue"}</td>
                </tr>
            `;
        }).join('')
        : `<tr><td colspan="6" style="text-align: center;">No matches found</td></tr>`;
}