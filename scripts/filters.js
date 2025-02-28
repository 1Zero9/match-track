// ✅ Initialize filters when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await populateTeamFilter();
    await populateYearFilter();
    await populateCompetitionFilter();
    await fetchMatches(); // Load matches on page load
});

// ✅ Populate team filter dynamically from Supabase
async function populateTeamFilter() {
    const teamFilter = document.getElementById('team-filter');
    if (!teamFilter) return;

    teamFilter.innerHTML = `<option value="all">Select Team</option>`; 

    try {
        const { data, error } = await window.supabase.from("teams").select("name");
        if (error) throw error;

        data.forEach(team => {
            const option = new Option(team.name, team.name);
            teamFilter.add(option);
        });
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
    } catch (error) {
        console.error("❌ Error loading competitions:", error);
    }
}

// ✅ Reset filters and reload matches
function resetFilters() {
    document.getElementById('team-filter').value = 'all';
    document.getElementById('year-filter').value = 'all';
    document.getElementById('date-filter').value = '';
    document.getElementById('competition-filter').value = 'all';

    fetchMatches(); // Reload matches without filters
}

// ✅ Apply filters dynamically
async function applyFilter() {
    const teamFilter = document.getElementById('team-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const competitionFilter = document.getElementById('competition-filter').value;

    try {
        let query = window.supabase.from("matches").select(`
            id, date, home_score, away_score,
            home_team:home_team_id (name),
            away_team:away_team_id (name),
            competition:competition_id (name)
        `);

        if (teamFilter !== 'all') {
            query = query.or(`home_team.name.eq.${teamFilter},away_team.name.eq.${teamFilter}`);
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

        displayMatches(data);
    } catch (error) {
        console.error("❌ Error applying filters:", error);
    }
}

// ✅ Display matches in table
function displayMatches(matches) {
    const tbody = document.getElementById('resultsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!matches || matches.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No matches found</td></tr>`;
        return;
    }

    matches.forEach(match => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${new Date(match.date).toLocaleDateString()}</td>
            <td>${match.home_team?.name || "Unknown Team"}</td>
            <td>${match.home_score} - ${match.away_score}</td>
            <td>${match.away_team?.name || "Unknown Team"}</td>
            <td>${match.competition?.name || "Unknown Competition"}</td>
        `;
    });
}
