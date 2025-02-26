// Sample data - replace with your actual data source
const matchData = [
    { date: '2024-01-15', homeTeam: 'Rangers A', awayTeam: 'United B', score: '2-1', competition: 'League' },
    { date: '2024-01-08', homeTeam: 'City C', awayTeam: 'Rangers A', score: '0-3', competition: 'Cup' },
    // ... more matches
];

// Initialize filters
document.addEventListener('DOMContentLoaded', () => {
    populateTeamFilter();
    populateYearFilter();
    populateCompetitionFilter();
    displayMatches(matchData);
});

function populateTeamFilter() {
    const teams = new Set();
    matchData.forEach(match => {
        teams.add(match.homeTeam);
        teams.add(match.awayTeam);
    });
    
    const teamFilter = document.getElementById('team-filter');
    teams.forEach(team => {
        const option = new Option(team, team);
        teamFilter.add(option);
    });
}

function populateYearFilter() {
    const years = new Set(
        matchData.map(match => new Date(match.date).getFullYear())
    );
    
    const yearFilter = document.getElementById('year-filter');
    Array.from(years).sort().reverse().forEach(year => {
        const option = new Option(year.toString(), year);
        yearFilter.add(option);
    });
}

function applyFilter() {
    const teamFilter = document.getElementById('team-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const competitionFilter = document.getElementById('competition-filter').value;

    let filteredMatches = matchData.filter(match => {
        if (teamFilter !== 'all' && 
            match.homeTeam !== teamFilter && 
            match.awayTeam !== teamFilter) return false;
        
        if (yearFilter !== 'all' && 
            new Date(match.date).getFullYear().toString() !== yearFilter) return false;
        
        if (dateFilter && match.date !== dateFilter) return false;
        
        if (competitionFilter !== 'all' && 
            match.competition !== competitionFilter) return false;
        
        return true;
    });

    displayMatches(filteredMatches);
}

function displayMatches(matches) {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    matches.forEach(match => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${formatDate(match.date)}</td>
            <td>${match.homeTeam}</td>
            <td>${match.score}</td>
            <td>${match.awayTeam}</td>
            <td>${match.competition}</td>
        `;
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}
