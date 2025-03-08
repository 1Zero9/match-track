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

// Display match results in the table with enhanced styling
function displayMatches(results) {
    const tbody = document.getElementById("resultsTableBody");
    const matchCount = document.getElementById("match-count");
    const noResults = document.getElementById("no-results");
    
    if (!tbody) return console.error("❌ Error: resultsTableBody not found.");
    
    // Update match count
    if (matchCount) matchCount.textContent = results.length;
    
    // Show/hide no results message
    if (noResults) {
        noResults.style.display = results.length === 0 ? 'block' : 'none';
    }

    if (results.length === 0) {
        tbody.innerHTML = '';
        return;
    }

    tbody.innerHTML = results.map(match => {
        // Format date nicely
        const matchDate = new Date(match.date);
        const formattedDate = matchDate.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric', 
            month: 'short', 
            year: 'numeric'
        });
        
        // Determine result class (win/loss/draw) if one of the teams is RVR
        let resultClass = '';
        if (match.home_team.name.includes('River Valley') || match.home_team.name.includes('RVR')) {
            if (match.home_score > match.away_score) resultClass = 'win';
            else if (match.home_score < match.away_score) resultClass = 'loss';
            else resultClass = 'draw';
        } else if (match.away_team.name.includes('River Valley') || match.away_team.name.includes('RVR')) {
            if (match.away_score > match.home_score) resultClass = 'win';
            else if (match.away_score < match.home_score) resultClass = 'loss';
            else resultClass = 'draw';
        }
        
        return `
            <tr class="${resultClass}" data-id="${match.id}">
                <td>${formattedDate}</td>
                <td>${match.home_team?.name || "Unknown Team"}</td>
                <td class="score-column">${match.home_score} - ${match.away_score}</td>
                <td>${match.away_team?.name || "Unknown Team"}</td>
                <td>${match.competition?.name || "Unknown Competition"}</td>
                <td>${match.venue?.name || "Unknown Venue"}</td>
            </tr>
        `;
    }).join('');
}

// Update filter function to work with enhanced table
function applyFilter() {
    const selectedTeam = document.getElementById("team-filter")?.value || "all";
    const homeAway = document.getElementById("home-away-filter")?.value || "all";
    const selectedYear = document.getElementById("year-filter")?.value || "all";
    const selectedDate = document.getElementById("date-filter")?.value || "all";
    const selectedCompetition = document.getElementById("competition-filter")?.value || "all";

    console.log("🔍 Applying filters:", { selectedTeam, homeAway, selectedYear, selectedDate, selectedCompetition });

    let visibleCount = 0;
    const rows = document.querySelectorAll("#resultsTableBody tr");
    
    rows.forEach(row => {
        const matchDate = row.cells[0]?.textContent || "";
        const homeTeam = row.cells[1]?.textContent || "";
        const awayTeam = row.cells[3]?.textContent || "";
        const competition = row.cells[4]?.textContent || "";

        let shouldShow = true;

        // Filter by Team (Matches Either Home or Away)
        if (selectedTeam !== "all" && homeTeam !== selectedTeam && awayTeam !== selectedTeam) {
            shouldShow = false;
        }

        // Filter by Home/Away
        if (homeAway === "home" && homeTeam !== selectedTeam) shouldShow = false;
        if (homeAway === "away" && awayTeam !== selectedTeam) shouldShow = false;

        // Extract Year from Match Date
        const rowYear = matchDate.split(' ').pop(); // Get the last part which should be the year
        if (selectedYear !== "all" && rowYear !== selectedYear) {
            shouldShow = false;
        }

        // Filter by Date
        if (selectedDate !== "all" && selectedDate !== "") {
            const filterDate = new Date(selectedDate);
            const rowDateParts = matchDate.split(', ')[1]?.split(' ') || [];
            if (rowDateParts.length >= 3) {
                // Try to create a date from the parts
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const day = parseInt(rowDateParts[0]);
                const month = monthNames.indexOf(rowDateParts[1]);
                const year = parseInt(rowDateParts[2]);
                if (!isNaN(day) && month !== -1 && !isNaN(year)) {
                    const rowDate = new Date(year, month, day);
                    if (filterDate.toDateString() !== rowDate.toDateString()) {
                        shouldShow = false;
                    }
                }
            }
        }

        // Filter by Competition
        if (selectedCompetition !== "all" && competition !== selectedCompetition) {
            shouldShow = false;
        }

        row.style.display = shouldShow ? "" : "none";
        if (shouldShow) visibleCount++;
    });
    
    // Update match count and show/hide no results message
    const matchCount = document.getElementById("match-count");
    if (matchCount) matchCount.textContent = visibleCount;
    
    const noResults = document.getElementById("no-results");
    if (noResults) {
        noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
}