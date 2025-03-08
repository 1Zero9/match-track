// Add this to the top of your existing filters.js file
document.addEventListener("DOMContentLoaded", () => {
    // Attach event listeners to filters
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
            element.addEventListener("change", () => {
                applyFilter();
            });
        }
    });
    
    // Initialize filters
    populateFilters();
});




// ✅ Populate filter dropdowns from Supabase
async function populateFilters() {
    await populateDropdown("teams", "team-filter");
    await populateDropdown("competitions", "competition-filter");
    populateYearFilter();  // ✅ Ensure year filter is populated
}

// ✅ Fetch teams and competitions dynamically
async function populateDropdown(table, elementId) {
    try {
        const { data, error } = await supabase.from(table).select("name");

        if (error) throw error;

        const dropdown = document.getElementById(elementId);
        if (!dropdown) return;

        dropdown.innerHTML = `<option value="all">All</option>`; // Default option
        data.forEach(item => {
            dropdown.innerHTML += `<option value="${item.name}">${item.name}</option>`;
        });

        console.log(`✅ Populated ${elementId} dropdown.`);
    } catch (error) {
        console.error(`❌ Error fetching ${table}:`, error);
    }
}

// ✅ Populate the year filter dynamically from match results
function populateYearFilter() {
    const yearFilter = document.getElementById("year-filter");
    if (!yearFilter) return;

    const uniqueYears = new Set();

    // ✅ Loop through all match rows and extract unique years
    document.querySelectorAll("#resultsTableBody tr").forEach(row => {
        const dateText = row.cells[0]?.textContent.trim();
        if (dateText) {
            const year = new Date(dateText).getFullYear();
            uniqueYears.add(year);
        }
    });

    // ✅ Populate dropdown
    yearFilter.innerHTML = `<option value="all">All Years</option>`;
    [...uniqueYears].sort().forEach(year => {
        yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });

    console.log("✅ Populated year-filter dropdown:", [...uniqueYears]);
}

// ✅ Apply filters when dropdowns change
function applyFilter() {
    const selectedTeam = document.getElementById("team-filter")?.value || "all";
    const homeAway = document.getElementById("home-away-filter")?.value || "all";
    const selectedYear = document.getElementById("year-filter")?.value || "all";
    const selectedDate = document.getElementById("date-filter")?.value || "all";
    const selectedCompetition = document.getElementById("competition-filter")?.value || "all";

    console.log("🔍 Applying filters:", { selectedTeam, homeAway, selectedYear, selectedDate, selectedCompetition });

    const rows = document.querySelectorAll("#resultsTableBody tr");
    rows.forEach(row => {
        const matchDate = row.cells[0]?.textContent || "";
        const homeTeam = row.cells[1]?.textContent || "";
        const awayTeam = row.cells[3]?.textContent || "";
        const competition = row.cells[4]?.textContent || "";

        let shouldShow = true;

        // ✅ Filter by Team (Matches Either Home or Away)
        if (selectedTeam !== "all" && homeTeam !== selectedTeam && awayTeam !== selectedTeam) {
            shouldShow = false;
        }

        // ✅ Filter by Home/Away
        if (homeAway === "home" && homeTeam !== selectedTeam) shouldShow = false;
        if (homeAway === "away" && awayTeam !== selectedTeam) shouldShow = false;

        // ✅ Extract Year from Match Date
        const rowYear = new Date(matchDate).getFullYear().toString();
        if (selectedYear !== "all" && rowYear !== selectedYear) {
            shouldShow = false;
        }

        // ✅ Filter by Date
        if (selectedDate !== "all" && matchDate !== selectedDate) {
            shouldShow = false;
        }

        // ✅ Filter by Competition
        if (selectedCompetition !== "all" && competition !== selectedCompetition) {
            shouldShow = false;
        }

        row.style.display = shouldShow ? "" : "none";
    });
}

// ✅ Reset filters and show all results
function resetFilters() {
    document.getElementById("team-filter").value = "all";
    document.getElementById("home-away-filter").value = "all";
    document.getElementById("year-filter").value = "all";
    document.getElementById("date-filter").value = "";
    document.getElementById("competition-filter").value = "all";

    applyFilter(); // Reapply filters to show all results
}

// ✅ Run when the page loads
document.addEventListener("DOMContentLoaded", populateFilters);
