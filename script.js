// Ensure Supabase is initialized before usage
const SUPABASE_URL = "https://tdocwsnhtwpqprqcrxro.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb2N3c25odHdwcXBycWNyeHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzc4ODIsImV4cCI6MjA1NTkxMzg4Mn0.f3bdQMdJAQaxMVqml2qdTxtweV1tD6dgAO8PgHnX9EQ";

let supabase;

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Checking authentication...");
    
    if (typeof supabase === "undefined") {
        supabase = window.supabase || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    console.log("Supabase initialized.");
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (window.location.pathname === "/index.html") {
            window.location.href = user ? "dashboard.html" : "login.html";
        }
    } catch (error) {
        console.error("Supabase authentication error:", error);
    }

    const buttons = document.querySelectorAll(".nav-btn");
    const dashboard = document.getElementById("dashboard");
    const logoutButton = document.querySelector(".logout");

    function showLoading() {
        dashboard.innerHTML = `<div class="loading">Loading...</div>`;
    }

    function loadPage(page) {
        showLoading();
        setTimeout(() => {
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
                        <label>Venue: <input type="text" id="venue" required></label><br>
                        <label>Competition: <input type="text" id="competition" required></label><br>
                        <label>Notes: <textarea id="notes"></textarea></label><br>
                        <button type="submit" class="nav-btn active">Save Match</button>
                    </form>
                    <p id="matchSuccess" class="success-message" style="display:none;">Match logged successfully!</p>
                `;

                document.getElementById("matchForm").addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const date = document.getElementById("matchDate").value;
                    const homeTeam = document.getElementById("homeTeam").value;
                    const awayTeam = document.getElementById("awayTeam").value;
                    const score = document.getElementById("score").value;
                    const venue = document.getElementById("venue").value;
                    const competition = document.getElementById("competition").value;
                    const notes = document.getElementById("notes").value;

                    if (!date || !homeTeam || !awayTeam || !score || !venue || !competition) {
                        alert("Please fill in all required fields.");
                        return;
                    }

                    const { data, error } = await supabase.from("matches").insert([
                        { date, home_team: homeTeam, away_team: awayTeam, score, venue, competition, notes }
                    ]);

                    if (error) {
                        alert("Error logging match: " + error.message);
                    } else {
                        document.getElementById("matchSuccess").style.display = "block";
                        setTimeout(() => document.getElementById("matchSuccess").style.display = "none", 3000);
                    }
                });
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
