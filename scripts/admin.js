document.addEventListener('DOMContentLoaded', async () => {
    if (!window.supabase) {
        console.error('❌ Supabase not initialized');
        return;
    }

    await Promise.all([
        populateTeamSelects(),
        populateCompetitions()
    ]);

    document.getElementById('match-form').addEventListener('submit', handleMatchSubmit);
});

async function populateTeamSelects() {
    try {
        const { data: teams, error } = await window.supabase
            .from('teams')
            .select('id, name')
            .order('name');

        if (error) throw error;

        const homeSelect = document.getElementById('home-team');
        const awaySelect = document.getElementById('away-team');

        teams.forEach(team => {
            homeSelect.add(new Option(team.name, team.id));
            awaySelect.add(new Option(team.name, team.id));
        });
    } catch (error) {
        console.error('❌ Error loading teams:', error);
    }
}

async function populateCompetitions() {
    try {
        const { data: competitions, error } = await window.supabase
            .from('competitions')
            .select('id, name')
            .order('name');

        if (error) throw error;

        const select = document.getElementById('competition');
        competitions.forEach(comp => {
            select.add(new Option(comp.name, comp.id));
        });
    } catch (error) {
        console.error('❌ Error loading competitions:', error);
    }
}

async function handleMatchSubmit(event) {
    event.preventDefault();
    
    const formData = {
        date: document.getElementById('match-date').value,
        home_team_id: document.getElementById('home-team').value,
        away_team_id: document.getElementById('away-team').value,
        home_score: document.getElementById('home-score').value,
        away_score: document.getElementById('away-score').value,
        competition_id: document.getElementById('competition').value
    };

    try {
        const { error } = await window.supabase
            .from('matches')
            .insert([formData]);

        if (error) throw error;

        alert('Match added successfully!');
        event.target.reset();
    } catch (error) {
        console.error('❌ Error adding match:', error);
        alert('Failed to add match. Please try again.');
    }
}
