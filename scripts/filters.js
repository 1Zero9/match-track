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

function resetFilters() {
    document.getElementById('team-filter').value = 'all';
    document.getElementById('year-filter').value = 'all';
    document.getElementById('date-filter').value = '';
    document.getElementById('competition-filter').value = 'all';
    
    displayMatches(matchData);
}

function applyFilter() {
    const teamFilter = document.getElementById('team-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const competitionFilter = document.getElementById('competition-filter').value;

    let filteredMatches = [...matchData]; // Create a copy of the original data

    if (teamFilter !== 'all') {
        filteredMatches = filteredMatches.filter(match => 
            match.homeTeam === teamFilter || match.awayTeam === teamFilter
        );
    }

    if (yearFilter !== 'all') {
        filteredMatches = filteredMatches.filter(match => 
            new Date(match.date).getFullYear().toString() === yearFilter
        );
    }

    if (dateFilter) {
        filteredMatches = filteredMatches.filter(match => 
            match.date === dateFilter
        );
    }

    if (competitionFilter !== 'all') {
        filteredMatches = filteredMatches.filter(match => 
            match.competition === competitionFilter
        );
    }

    displayMatches(filteredMatches);
}

function displayMatches(matches) {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    if (matches.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'No matches found';
        cell.style.textAlign = 'center';
        cell.style.padding = '20px';
        return;
    }
    
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
