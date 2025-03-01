(async function () {
    if (typeof window.supabase === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";
        script.onload = () => {
            console.log("✅ Supabase library loaded.");
            initializeSupabase();
        };
        document.head.appendChild(script);
    } else {
        initializeSupabase();
    }
})();

function initializeSupabase() {
    console.log("Initializing Supabase...");
    
    // ✅ Supabase client setup
    const SUPABASE_URL = "https://ozsraoyortbvkckymdll.supabase.co";  
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96c3Jhb3lvcnRidmtja3ltZGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjE3NzgsImV4cCI6MjA1NjMzNzc3OH0.va3ZxmhrHsHC_T5WwiUr1n6i8euftfW-NDBbCQaAS9Q";  

    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase initialized.");

    // 🚀 Ensure filters and match fetching run after Supabase is ready
    setTimeout(() => {
        console.log("🚀 Fetching matches now...");
        fetchMatches();
        populateTeamFilter();
        populateYearFilter();
        populateCompetitionFilter();
    }, 2000);
}

// ✅ Fetch match results from the database
async function fetchMatches() {
    console.log("Fetching match results...");

    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) {
        console.error("❌ Error: resultsTableBody element not found.");
        return;
    }

    try {
        const { data, error } = await window.supabase
            .from("matches")
            .select(`
                id, date, home_score, away_score,
                home_team:home_team_id (name),
                away_team:away_team_id (name),
                competition:competition_id (name)
            `)
            .order("date", { ascending: false });

        if (error) throw error;

        console.log("✅ Fetched match data:", data);

        if (!data || data.length === 0) {
            console.warn("⚠ No matches found in the database.");
        }

        displayMatches(data);
    } catch (error) {
        console.error("❌ Error fetching matches:", error);
    }
}

// ✅ Function to display match results
function displayMatches(results) {
    console.log("Rendering match results...", results);
    
    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) {
        console.error("❌ Error: resultsTableBody not found.");
        return;
    }

    tbody.innerHTML = '';  

    if (!results || results.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No matches found</td></tr>`;
        return;
    }

    results.forEach(match => {
        const row = document.createElement('tr');

        const matchDate = new Date(match.date).toLocaleDateString();
        const homeTeam = match.home_team ? match.home_team.name : "Unknown Team";
        const awayTeam = match.away_team ? match.away_team.name : "Unknown Team";
        const competition = match.competition ? match.competition.name : "Unknown Competition";

        row.innerHTML = `
            <td>${matchDate}</td>
            <td>${homeTeam}</td>
            <td>${match.home_score} - ${match.away_score}</td>
            <td>${awayTeam}</td>
            <td>${competition}</td>
        `;

        tbody.appendChild(row);
    });
}

// ✅ Handle adding a new match from admin.html
async function addMatch(event) {
    event.preventDefault();

    const matchDate = document.getElementById("match-date").value;
    const homeTeam = document.getElementById("home-team").value;
    const awayTeam = document.getElementById("away-team").value;
    const homeScore = document.getElementById("home-score").value;
    const awayScore = document.getElementById("away-score").value;
    const competition = document.getElementById("competition").value;

    try {
        const { data: homeTeamData, error: homeTeamError } = await window.supabase
            .from("teams")
            .select("id")
            .eq("name", homeTeam)
            .single();

        const { data: awayTeamData, error: awayTeamError } = await window.supabase
            .from("teams")
            .select("id")
            .eq("name", awayTeam)
            .single();

        const { data: competitionData, error: competitionError } = await window.supabase
            .from("competitions")
            .select("id")
            .eq("name", competition)
            .single();

        if (homeTeamError || awayTeamError || competitionError) {
            console.error("❌ Error fetching team/competition IDs:", homeTeamError, awayTeamError, competitionError);
            return;
        }

        const { error: insertError } = await window.supabase.from("matches").insert([
            {
                date: matchDate,
                home_team_id: homeTeamData.id,
                away_team_id: awayTeamData.id,
                home_score: homeScore,
                away_score: awayScore,
                competition_id: competitionData.id
            }
        ]);

        if (insertError) throw insertError;

        console.log("✅ Match added successfully!");
        fetchMatches(); // Refresh match list
    } catch (error) {
        console.error("❌ Error adding match:", error);
    }
}

// ✅ Handle deleting a match
async function deleteMatch(matchId) {
    if (!confirm("Are you sure you want to delete this match?")) return;

    try {
        const { error } = await window.supabase.from("matches").delete().eq("id", matchId);
        if (error) throw error;

        console.log("✅ Match deleted successfully!");
        fetchMatches();
    } catch (error) {
        console.error("❌ Error deleting match:", error);
    }
}

// ✅ Attach event listeners for adding matches
document.addEventListener("DOMContentLoaded", () => {
    const matchForm = document.getElementById("match-form");
    if (matchForm) {
        matchForm.addEventListener("submit", addMatch);
    }
});
