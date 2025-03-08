// matches.js - Updated for card-based layout

// Fetch match results and display them in the cards
async function fetchMatches() {
    console.log("📊 Fetching match results...");

    const resultsGrid = document.getElementById("results-grid");
    if (!resultsGrid) {
        console.warn("⚠ No results grid found. Skipping fetch.");
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

// Display match results as cards
function displayMatches(results) {
    const resultsGrid = document.getElementById("results-grid");
    const matchCount = document.getElementById("match-count");
    const noResults = document.getElementById("no-results");
    
    if (!resultsGrid) return console.error("❌ Error: results-grid not found.");
    
    // Update match count
    matchCount.textContent = results.length;
    
    // Show/hide no results message
    if (results.length === 0) {
        resultsGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }

    // Create cards for each match
    resultsGrid.innerHTML = results.map(match => {
        // Format date nicely
        const matchDate = new Date(match.date);
        const formattedDate = matchDate.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        });
        
        // Determine result class (for potential win/loss/draw styling)
        let resultClass = '';
        if (match.home_team.name === 'River Valley Rangers') {
            if (match.home_score > match.away_score) resultClass = 'win';
            else if (match.home_score < match.away_score) resultClass = 'loss';
            else resultClass = 'draw';
        } else if (match.away_team.name === 'River Valley Rangers') {
            if (match.away_score > match.home_score) resultClass = 'win';
            else if (match.away_score < match.home_score) resultClass = 'loss';
            else resultClass = 'draw';
        }
        
        return `
            <div class="match-card ${resultClass}" data-id="${match.id}">
                <div class="match-date">${formattedDate}</div>
                <div class="match-competition">${match.competition?.name || "Unknown Competition"}</div>
                
                <div class="match-details">
                    <div class="team home-team">
                        <div class="team-name">${match.home_team?.name || "Unknown Team"}</div>
                    </div>
                    
                    <div class="match-score">
                        <span class="score">${match.home_score}</span>
                        <span class="score-divider">-</span>
                        <span class="score">${match.away_score}</span>
                    </div>
                    
                    <div class="team away-team">
                        <div class="team-name">${match.away_team?.name || "Unknown Team"}</div>
                    </div>
                </div>
                
                <div class="match-venue">
                    <span class="venue-label">Venue:</span>
                    <span class="venue-name">${match.venue?.name || "Unknown Venue"}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Handle filtering for card-based layout
function applyFilter() {
    const selectedTeam = document.getElementById("team-filter")?.value || "all";
    const homeAway = document.getElementById("home-away-filter")?.value || "all";
    const selectedYear = document.getElementById("year-filter")?.value || "all";
    const selectedDate = document.getElementById("date-filter")?.value || "all";
    const selectedCompetition = document.getElementById("competition-filter")?.value || "all";

    console.log("🔍 Applying filters:", { selectedTeam, homeAway, selectedYear, selectedDate, selectedCompetition });

    let visibleCount = 0;
    const cards = document.querySelectorAll(".match-card");
    
    cards.forEach(card => {
        const matchDate = card.querySelector(".match-date")?.textContent || "";
        const homeTeam = card.querySelector(".home-team .team-name")?.textContent || "";
        const awayTeam = card.querySelector(".away-team .team-name")?.textContent || "";
        const competition = card.querySelector(".match-competition")?.textContent || "";

        let shouldShow = true;

        // Filter by Team (Matches Either Home or Away)
        if (selectedTeam !== "all" && homeTeam !== selectedTeam && awayTeam !== selectedTeam) {
            shouldShow = false;
        }

        // Filter by Home/Away
        if (homeAway === "home" && homeTeam !== selectedTeam) shouldShow = false;
        if (homeAway === "away" && awayTeam !== selectedTeam) shouldShow = false;

        // Extract Year from Match Date
        const rowYear = new Date(matchDate).getFullYear().toString();
        if (selectedYear !== "all" && rowYear !== selectedYear) {
            shouldShow = false;
        }

        // Filter by Date (using formatted date, need to match formats)
        if (selectedDate !== "all" && selectedDate !== "") {
            const filterDate = new Date(selectedDate);
            const cardDateStr = matchDate.split(',')[1].trim(); // Extract just the date part
            const cardDate = new Date(cardDateStr);
            
            if (filterDate.toDateString() !== cardDate.toDateString()) {
                shouldShow = false;
            }
        }

        // Filter by Competition
        if (selectedCompetition !== "all" && competition !== selectedCompetition) {
            shouldShow = false;
        }

        card.style.display = shouldShow ? "" : "none";
        if (shouldShow) visibleCount++;
    });
    
    // Update match count and show/hide no results message
    document.getElementById("match-count").textContent = visibleCount;
    document.getElementById("no-results").style.display = visibleCount === 0 ? "block" : "none";
}