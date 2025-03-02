// ✅ Ensure scripts only run after Supabase is available
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Initializing Match Tracker...");

    // ✅ Ensure Supabase is loaded before calling other scripts
    if (typeof supabase === "undefined") {
        console.error("❌ Supabase not found. Ensure supabase.js loads first.");
        return;
    }

    // ✅ Load footer dynamically
    loadFooter();

    // ✅ Fetch match results
    fetchMatches();

    // ✅ Populate filters
    populateFilters();

    // ✅ Attach event listeners (if forms exist)
    attachEventListeners();
});

// ✅ Function to dynamically load the footer
function loadFooter() {
    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data)
        .catch(error => console.error("❌ Error loading footer:", error));
}

// ✅ Function to attach event listeners
function attachEventListeners() {
    // ✅ Add match form submission listener
    const matchForm = document.getElementById("match-form");
    if (matchForm) {
        matchForm.addEventListener("submit", addMatch);
    }

    // ✅ Ensure filter dropdowns trigger filter function
    const filterElements = ["team-filter", "home-away-filter", "year-filter", "date-filter", "competition-filter"];
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.addEventListener("change", applyFilter);
    });

    // ✅ Ensure Reset Filters button works
    const resetButton = document.querySelector(".reset-button");
    if (resetButton) {
        resetButton.addEventListener("click", resetFilters);
    }
}
