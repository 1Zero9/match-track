document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".nav-btn");
    const dashboard = document.getElementById("dashboard");

    // Function to update active button and load content
    function loadPage(page) {
        buttons.forEach(btn => btn.classList.remove("active"));
        document.querySelector(`[data-page="${page}"]`).classList.add("active");

        if (page === "home") {
            dashboard.innerHTML = `
                <h2>Welcome to the Match Tracker</h2>
                <p>Track and manage your football matches with ease.</p>
            `;
        } else if (page === "log") {
            dashboard.innerHTML = `
                <h2>Log a Match</h2>
                <form id="matchForm">
                    <label>Date: <input type="date" id="matchDate" required></label><br>
                    <label>Home Team: <input type="text" id="homeTeam" required></label><br>
                    <label>Away Team: <input type="text" id="awayTeam" required></label><br>
                    <label>Score: <input type="text" id="score" required></label><br>
                    <button type="submit" class="nav-btn active">Save Match</button>
                </form>
            `;

            document.getElementById("matchForm").addEventListener("submit", (e) => {
                e.preventDefault();
                alert("Match Logged!");
            });
        } else if (page === "view") {
            dashboard.innerHTML = `
                <h2>Match History</h2>
                <p>Coming Soon...</p>
            `;
        } else if (page === "settings") {
            dashboard.innerHTML = `
                <h2>Settings</h2>
                <p>Modify your preferences here.</p>
            `;
        }
    }

    // Assign click event to buttons
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.innerText.toLowerCase().replace(" ", "");
            loadPage(page);
        });
    });

    // Load home page by default
    loadPage("home");
});
