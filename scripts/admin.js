document.addEventListener('DOMContentLoaded', async () => {
    if (!window.supabase) {
        console.error('❌ Supabase not initialized');
        return;
    }

    await Promise.all([
        populateTeamSelects(),
        populateCompetitions(),
        populateVenues()
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

async function populateVenues() {
    try {
        const { data: venues, error } = await window.supabase
            .from('venues')
            .select('id, name')
            .order('name');

        if (error) throw error;

        const select = document.getElementById('venue');
        venues.forEach(venue => {
            select.add(new Option(venue.name, venue.id));
        });
    } catch (error) {
        console.error('❌ Error loading venues:', error);
    }
}

async function handleMatchSubmit(event) {
    event.preventDefault();
    
    const homeTeamId = document.getElementById('home-team').value;
    const awayTeamId = document.getElementById('away-team').value;
    
    if (homeTeamId === awayTeamId) {
        alert('Home and away team cannot be the same');
        return;
    }
    
    const formData = {
        date: document.getElementById('match-date').value,
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        home_score: document.getElementById('home-score').value,
        away_score: document.getElementById('away-score').value,
        competition_id: document.getElementById('competition').value,
        venue_id: document.getElementById('venue').value,
        created_at: new Date().toISOString()
    };

    // Add user ID if available
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.id) {
        formData.created_by = user.id;
    }

    try {
        const { error } = await window.supabase
            .from('matches')
            .insert([formData]);

        if (error) throw error;

        alert('Match added successfully!');
        event.target.reset();
    } catch (error) {
        console.error('❌ Error adding match:', error);
        alert('Failed to add match: ' + (error.message || 'Please try again.'));
    }
}