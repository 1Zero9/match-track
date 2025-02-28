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
    
    // ✅ New Supabase Database URL & Key
    const SUPABASE_URL = "https://ozsraoyortbvkckymdll.supabase.co";  
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96c3Jhb3lvcnRidmtja3ltZGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjE3NzgsImV4cCI6MjA1NjMzNzc3OH0.va3ZxmhrHsHC_T5WwiUr1n6i8euftfW-NDBbCQaAS9Q";  

    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase initialized.");

    // 🚀 Fetch matches once initialized
    setTimeout(() => {
        console.log("🚀 Fetching matches now...");
        fetchMatches();
    }, 2000);
}

// ✅ Fetch match results from the new database
async function fetchMatches() {
    console.log("Fetching match results...");

    // ✅ Ensure the table exists in the DOM
    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) {
        console.error("❌ Error: resultsTableBody element not found.");
        return;
    }

    try {
        const { data, error } = await window.supabase
            .from("matches")
            .select(`
                id,
                date,
                home_score,
                away_score,
                home_team:home_team_id (name),
                away_team:away_team_id (name),
                competition:competition_id (name),
                venue:venue_id (name)
            `)
            .order("date", { ascending: false });

        if (error) throw error;

        console.log("✅ Fetched match data:", data);

        if (!data || data.length === 0) {
            console.warn("⚠ No matches found in the database.");
        }

        displayResults(data);
    } catch (error) {
        console.error("❌ Error fetching matches:", error);
    }
}

// ✅ Function to display match results in the table
function displayResults(results) {
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

    results.forEach((match, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.05}s`;

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
