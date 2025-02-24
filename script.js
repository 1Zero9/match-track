// Ensure Supabase is properly loaded before using it
if (typeof supabase === "undefined") {
    document.write('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"><\/script>');
}

// Initialize Supabase correctly
const SUPABASE_URL = "https://tdocwsnhtwpqprqcrxro.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb2N3c25odHdwcXBycWNyeHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzc4ODIsImV4cCI6MjA1NTkxMzg4Mn0.f3bdQMdJAQaxMVqml2qdTxtweV1tD6dgAO8PgHnX9EQ";

let supabase;

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Checking authentication...");
    
    // Ensure Supabase is fully initialized before use
    if (typeof supabase === "undefined" || !window.supabase) {
        supabase = window.supabase || window.supabase_js.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    console.log("Supabase initialized.");
    
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        const user = data.user;

        if (!user) {
            window.location.href = "login.html";
        } else {
            document.getElementById("user-email").textContent = user.email;
        }
    } catch (error) {
        console.error("Supabase authentication error:", error);
    }

    const buttons = document.querySelectorAll(".nav-btn");
    const dashboard = document.getElementById("dashboard");
    const logoutButton = document.querySelector(".logout");

    if (!dashboard) {
        console.error("Dashboard element not found.");
        return;
    }

    function showLoading() {
        dashboard.innerHTML = `<div class="loading">Loading...</div>`;
    }

    function loadPage(page) {
        showLoading();
        setTimeout(() => {
            buttons.forEach(btn => btn.classList.remove("active"));
            const activeButton = document.querySelector(`[data-page="${page}"]`);
            if (activeButton) activeButton.classList.add("active");

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
                        <label>Venue: <input type="text" id="venue" required></label><br>
                        <label>Competition: <input type="text" id="competition" required></label><br>
                        <label>Notes: <textarea id="notes"></textarea></label><br>
                        <button type="submit" class="nav-btn active">Save Match</button>
                    </form>
                    <p id="matchSuccess" class="success-message" style="display:none;">Match logged successfully!</p>
                `;
            } else if (page === "view") {
                dashboard.innerHTML = `
                    <h2>Match History</h2>
                    <div id="matchList">Loading...</div>
                `;
                loadMatchHistory();
            } else if (page === "settings") {
                dashboard.innerHTML = `
                    <h2>Settings</h2>
                    <p>Modify your preferences here.</p>
                `;
            }
        }, 500);
    }

    async function loadMatchHistory() {
        const matchList = document.getElementById("matchList");
        if (!matchList) return;

        const { data, error } = await supabase.from("matches").select("*");

        if (error) {
            matchList.innerHTML = `<p>Error loading matches.</p>`;
        } else {
            matchList.innerHTML = data.map(match => `
                <div class="match-item">
                    <strong>${match.date}</strong>: ${match.home_team} vs ${match.away_team} - ${match.score}
                    <br>Venue: ${match.venue} | Competition: ${match.competition}
                    <br><em>${match.notes}</em>
                </div>
            `).join("");
        }
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.innerText.toLowerCase().replace(" ", "");
            loadPage(page);
        });
    });

    loadPage("home");

    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            await supabase.auth.signOut();
            window.location.href = "login.html";
        });
    }
});