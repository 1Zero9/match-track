// Main initialization
document.addEventListener("supabaseReady", () => {
    console.log("🚀 Supabase is ready! Initializing Match Tracker...");
    initializeApp();
});

// Initialize all app components
function initializeApp() {
    loadFooter();
    fetchMatches();
    populateFilters();
    attachEventListeners();
}

// Load footer dynamically
function loadFooter() {
    const footer = document.getElementById("footer");
    if (!footer) {
        console.warn("⚠ Footer container not found.");
        return;
    }

    fetch("footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("❌ Failed to load footer.");
            }
            return response.text();
        })
        .then(data => {
            footer.innerHTML = data;
            console.log("✅ Footer loaded successfully.");
        })
        .catch(error => console.error("❌ Error loading footer:", error));
}

// Attach all event listeners
function attachEventListeners() {
    // Match form submission listener
    const matchForm = document.getElementById("match-form");
    if (matchForm) {
        matchForm.addEventListener("submit", addMatch);
    }

    // Filter change listeners
    const filterElements = [
        "team-filter", 
        "home-away-filter", 
        "year-filter", 
        "date-filter", 
        "competition-filter"
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("change", applyFilter);
        }
    });

    // Reset filters button
    const resetButton = document.querySelector(".reset-button");
    if (resetButton) {
        resetButton.addEventListener("click", resetFilters);
    }
}

// Also initialize on DOM content loaded (fallback)
document.addEventListener("DOMContentLoaded", () => {
    if (window.supabase) {
        initializeApp();
    }
});
