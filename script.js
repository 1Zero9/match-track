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
    
    const SUPABASE_URL = "https://tdocwsnhtwpqprqcrxro.supabase.co";  
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb2N3c25odHdwcXBycWNyeHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzc4ODIsImV4cCI6MjA1NTkxMzg4Mn0.f3bdQMdJAQaxMVqml2qdTxtweV1tD6dgAO8PgHnX9EQ";  

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error("❌ Supabase URL or API Key missing!");
        return;
    }

    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase initialized.");

    setTimeout(fetchMatches, 2000); // 🔥 Added delay to ensure Supabase is fully initialized
}

// Function to fetch match results
async function fetchMatches() {
    console.log("Fetching match results...");

    try {
        const { data, error } = await window.supabase
            .from("matches")
            .select(`
                id,
                date,
                home_score,
                away_score,
                result,
                home_team:home_team_id (name),
                away_team:away_team_id (name),
                competition:competition_id (name),
                venue:venue_id (name)
            `)
            .order("date", { ascending: false }); // Show latest matches first

        if (error) throw error;

        console.log("✅ Fetched match data:", data);  // 🔥 Added debugging log

        if (!data || data.length === 0) {
            console.warn("⚠ No matches found in the database.");
        }

        displayResults(data);
    } catch (error) {
        console.error("❌ Error fetching matches:", error);
        document.getElementById('resultsTableBody').innerHTML = `
            <tr><td colspan="5" style="text-align: center; color: red;">
                Error loading matches. Please try again later.
            </td></tr>
        `;
    }
}

// Function to display match results in the table
function displayResults(results) {
    console.log("Rendering match results...", results);
    
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';  // Clear previous entries

    if (!results || results.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No matches found</td></tr>`;
        return;
    }

    results.forEach((match, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.05}s`;

        const matchDate = new Date(match.date).toLocaleDateString();

        // ✅ Handles missing/null values safely
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
