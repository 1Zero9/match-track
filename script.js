// Function to add setup data (Teams, Venues, Opponents)
function addSetupData() {
    const teamName = document.getElementById('team-name').value;
    const venueName = document.getElementById('venue-name').value;
    const opponentName = document.getElementById('opponent-name').value;

    // Add logic to save these values to the database
    // For example, using fetch API to send data to your backend

    // Clear the input fields
    document.getElementById('team-name').value = '';
    document.getElementById('venue-name').value = '';
    document.getElementById('opponent-name').value = '';
}

// Function to log a match
function logMatch() {
    const team = document.getElementById('log-team-select').value;
    const venue = document.getElementById('log-venue-select').value;
    const opponent = document.getElementById('log-opponent-select').value;
    const date = document.getElementById('log-date').value;
    const score = document.getElementById('log-score').value;

    // Add logic to save the match data to the database
    // For example, using fetch API to send data to your backend

    // Clear the input fields
    document.getElementById('log-team-select').value = '';
    document.getElementById('log-venue-select').value = '';
    document.getElementById('log-opponent-select').value = '';
    document.getElementById('log-date').value = '';
    document.getElementById('log-score').value = '';
}

// Function to populate dropdowns with existing data
function populateDropdowns() {
    // Fetch existing Teams, Venues, and Opponents from the database
    // For example, using fetch API to get data from your backend

    // Populate the dropdowns with the fetched data
    // Example:
    // const teams = fetchTeamsFromDatabase();
    // const teamSelect = document.getElementById('log-team-select');
    // teams.forEach(team => {
    //     const option = document.createElement('option');
    //     option.value = team.id;
    //     option.textContent = team.name;
    //     teamSelect.appendChild(option);
    // });
}

// Call populateDropdowns when the page loads
document.addEventListener('DOMContentLoaded', populateDropdowns);