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
    
    const SUPABASE_URL = "https://ozsraoyortbvkckymdll.supabase.co";  
    const SUPABASE_ANON_KEY = "YOUR_ANON_KEY"; // Ensure this is stored securely

    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase initialized.");

    if (document.getElementById("resultsTableBody")) {
        console.log("🚀 Fetching matches now...");
        fetchMatches();
    } else {
        console.log("⚠ No match table detected, skipping fetchMatches.");
    }

    attachEventListeners();
}

// ✅ Fetch match results from the database
async function fetchMatches() {
    console.log("Fetching match results...");

    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) {
        console.warn("⚠ No match table found. Skipping fetch.");
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
        displayMatches(data);
    } catch (error) {
        console.error("❌ Error fetching matches:", error);
    }
}

// ✅ Function to display match results
function displayMatches(results) {
    console.log("Rendering match results...", results);
    
    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) return console.error("❌ Error: resultsTableBody not found.");

    tbody.innerHTML = results.length
        ? results.map(match => `
            <tr>
                <td>${new Date(match.date).toLocaleDateString()}</td>
                <td>${match.home_team?.name || "Unknown Team"}</td>
                <td>${match.home_score} - ${match.away_score}</td>
                <td>${match.away_team?.name || "Unknown Team"}</td>
                <td>${match.competition?.name || "Unknown Competition"}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="5" style="text-align: center;">No matches found</td></tr>`;
}

// ✅ Handle inserting a new match
async function addMatch(event) {
    event.preventDefault();

    const matchDate = document.getElementById("match-date").value;
    const homeTeam = document.getElementById("home-team").value;
    const awayTeam = document.getElementById("away-team").value;
    const homeScore = document.getElementById("home-score").value;
    const awayScore = document.getElementById("away-score").value;
    const competition = document.getElementById("competition").value;

    try {
        const [homeTeamData, awayTeamData, competitionData] = await Promise.all([
            getEntityId("teams", homeTeam),
            getEntityId("teams", awayTeam),
            getEntityId("competitions", competition)
        ]);

        if (!homeTeamData || !awayTeamData || !competitionData) {
            console.error("❌ Error fetching necessary IDs.");
            return;
        }

        const { error } = await window.supabase.from("matches").insert([
            {
                date: matchDate,
                home_team_id: homeTeamData.id,
                away_team_id: awayTeamData.id,
                home_score: homeScore,
                away_score: awayScore,
                competition_id: competitionData.id
            }
        ]);

        if (error) throw error;

        console.log("✅ Match added successfully!");
        fetchMatches();
    } catch (error) {
        console.error("❌ Error adding match:", error);
    }
}

// ✅ Fetch ID of an entity (team, venue, competition)
async function getEntityId(table, name) {
    try {
        const { data, error } = await window.supabase
            .from(table)
            .select("id")
            .eq("name", name)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`❌ Error fetching ${name} from ${table}:`, error);
        return null;
    }
}

// ✅ Handle inserting a new team, venue, or competition
async function insertItem(table, itemName) {
    console.log(`🚀 Adding ${itemName} to ${table}...`);
    
    try {
        const { error } = await window.supabase.from(table).insert([{ name: itemName }]);

        if (error) throw error;
        console.log(`✅ ${itemName} added successfully to ${table}.`);
        
        document.getElementById(`${table}-name`).value = "";
    } catch (error) {
        console.error(`❌ Error inserting ${itemName} into ${table}:`, error);
    }
}

// ✅ Attach event listeners
function attachEventListeners() {
    if (document.getElementById("match-form")) {
        document.getElementById("match-form").addEventListener("submit", addMatch);
    }

    ["team", "venue", "competition"].forEach(type => {
        const form = document.getElementById(`${type}-form`);
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                insertItem(`${type}s`, document.getElementById(`${type}-name`).value);
            });
        }
    });
}
