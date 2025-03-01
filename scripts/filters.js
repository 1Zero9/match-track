// ✅ Ensure Supabase is available before running filters
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof window.supabase === "undefined") {
        console.warn("⚠ Supabase not initialized yet. Retrying...");
        setTimeout(() => {
            populateTeamFilter();
            populateYearFilter();
            populateCompetitionFilter();
            fetchMatches();
        }, 2000);
    } else {
        await populateTeamFilter();
        await populateYearFilter();
        await populateCompetitionFilter();
        await fetchMatches();
    }
});

// ✅ Populate team filter dynamically from Supabase
async function populateTeamFilter() {
    if (!window.supabase) {
        console.warn("⚠ Supabase not ready for team filter.");
        return;
    }

    const teamFilter = document.getElementById('team-filter');
    if (!teamFilter) return;

    teamFilter.innerHTML = `<option value="all">Select Team</option>`; 

    try {
        const { data, error } = await window.supabase.from("teams").select("id, name");
        if (error) throw error;

        data.forEach(team => {
            const option = new Option(team.name, team.id);
            teamFilter.add(option);
        });

        console.log("✅ Team Filter Populated:", data);
    } catch (error) {
        console.error("❌ Error loading teams:", error);
    }
}

// ✅ Populate year filter dynamically
async function populateYearFilter() {
    const yearFilter = document.getElementById('year-filter');
    if (!yearFilter) return;

    const currentYear = new Date().getFullYear();
    yearFilter.innerHTML = `<option value="all">All Years</option>`;

    for (let year = currentYear; year >= 2000; year--) {
        const option = new Option(year.toString(), year);
        yearFilter.add(option);
    }
}

// ✅ Populate competition filter dynamically from Supabase
async function populateCompetitionFilter() {
    if (!window.supabase) {
        console.warn("⚠ Supabase not ready for competition filter.");
        return;
    }

    const competitionFilter = document.getElementById('competition-filter');
    if (!competitionFilter) return;

    competitionFilter.innerHTML = `<option value="all">Filter by...</option>`; 

    try {
        const { data, error } = await window.supabase.from("competitions").select("name");
        if (error) throw error;

        data.forEach(comp => {
            const option = new Option(comp.name, comp.name);
            competitionFilter.add(option);
        });

        console.log("✅ Competition Filter Populated:", data);
    } catch (error) {
        console.error("❌ Error loading competitions:", error);
    }
}

// ✅ Apply filters dynamically
async function applyFilter() {
    const teamFilter = document.getElementById('team-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const competitionFilter = document.getElementById('competition-filter').value;

    try {
        let query = window.supabase
            .from("matches")
            .select(`
                id, date, home_score, away_score,
                home_team_id, away_team_id,
                home_team:home_team_id (name),
                away_team:away_team_id (name),
                competition:competition_id (name)
            `);

        if (teamFilter !== 'all') {
            query = query.or(`home_team_id.eq.${teamFilter},away_team_id.eq.${teamFilter}`);
        }

        if (yearFilter !== 'all') {
            query = query.gte("date", `${yearFilter}-01-01`).lte("date", `${yearFilter}-12-31`);
        }

        if (dateFilter) {
            query = query.eq("date", dateFilter);
        }

        if (competitionFilter !== 'all') {
            query = query.eq("competition.name", competitionFilter);
        }

        const { data, error } = await query;
        if (error) throw error;

        console.log("✅ Filtered Match Data:", data);

        displayMatches(data);
    } catch (error) {
        console.error("❌ Error applying filters:", error);
    }
}