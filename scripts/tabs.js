function openTab(tabId) {
    // Hide all tab content
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none";
    });

    // Remove active class from all buttons
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });

    // Show selected tab and set button as active
    document.getElementById(tabId).style.display = "block";
    event.currentTarget.classList.add("active");
}

// ✅ Set default active tab on page load
document.addEventListener("DOMContentLoaded", () => {
    openTab("log-match");
});
