// Ensure Supabase library is loaded before using it
(async function() {
    if (typeof window.supabase === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";
        script.onload = initializeSupabase;
        document.head.appendChild(script);
    } else {
        initializeSupabase();
    }
})();

// Initialize Supabase only after the script is loaded
function initializeSupabase() {
    console.log("Initializing Supabase...");
    
    const SUPABASE_URL = "https://tdocwsnhtwpqprqcrxro.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb2N3c25odHdwcXBycWNyeHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzc4ODIsImV4cCI6MjA1NTkxMzg4Mn0.f3bdQMdJAQaxMVqml2qdTxtweV1tD6dgAO8PgHnX9EQ";
    
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase initialized.");

    // Detect which page we are on and load the appropriate data
    if (document.getElementById("test-data")) {
        fetchTestData();
    } else if (document.getElementById("admin-data")) {
        fetchAdminData();
    }

    setupFormListener();
    setupEditListener();
}

// Fetch match results for index.html
async function fetchTestData() {
    const list = document.getElementById("test-data");
    if (!list) {
        console.warn("⚠ Warning: test-data element not found.");
        return;
    }
    list.innerHTML = "Loading...";

    try {
        const { data, error } = await window.supabase.from("test_entries").select("*");
        if (error) throw error;
        list.innerHTML = data.map(entry => `
            <li>
                ${entry.name} - ${entry.created_at}
                <button onclick="editEntry(${entry.id}, '${entry.name}')">Edit</button>
                <button onclick="confirmDelete(${entry.id})">Delete</button>
            </li>`
        ).join("");
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        list.innerHTML = "Failed to load data.";
    }
}

// Fetch match results for admin.html
async function fetchAdminData() {
    const list = document.getElementById("admin-data");
    if (!list) {
        console.warn("⚠ Warning: admin-data element not found.");
        return;
    }
    list.innerHTML = "Loading...";

    try {
        const { data, error } = await window.supabase.from("matches").select("*");
        if (error) throw error;
        list.innerHTML = data.map(match => `
            <li class="match-card">
                <strong>${match.home_team} vs ${match.away_team}</strong>
                <span>Score: ${match.score}</span>
                <button onclick="editMatch(${match.id}, '${match.home_team}', '${match.away_team}', '${match.score}')">Edit</button>
                <button onclick="confirmDelete(${match.id})">Delete</button>
            </li>`
        ).join("");
    } catch (error) {
        console.error("❌ Error fetching admin data:", error);
        list.innerHTML = "Failed to load data.";
    }
}

// Ensure form submission works
function setupFormListener() {
    const form = document.getElementById("test-form");
    if (!form) {
        console.warn("⚠ Warning: Form element not found. Skipping event listener setup.");
        return;
    }
    
    const statusMessage = document.getElementById("status-message");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const entryName = document.getElementById("entry-name").value;
        
        if (!entryName) {
            statusMessage.textContent = "Please enter a name.";
            return;
        }
        
        try {
            const { data, error } = await window.supabase.from("test_entries").insert([{ name: entryName }]);
            if (error) throw error;
            
            statusMessage.textContent = "✅ Entry added successfully!";
            form.reset();
            fetchTestData(); // Refresh the list
        } catch (error) {
            console.error("❌ Error inserting data:", error);
            statusMessage.textContent = "Failed to add entry.";
        }
    });
}

// Confirm before deleting
function confirmDelete(id) {
    if (confirm("Are you sure you want to delete this entry?")) {
        deleteEntry(id);
    }
}

// Delete an entry
async function deleteEntry(id) {
    try {
        const { error } = await window.supabase.from("test_entries").delete().eq("id", id);
        if (error) throw error;
        fetchTestData();
    } catch (error) {
        console.error("❌ Error deleting data:", error);
    }
}

// Edit an entry
function editEntry(id, name) {
    if (!confirm("Are you sure you want to edit this entry?")) return;
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-name").value = name;
    document.getElementById("edit-form").style.display = "block";
}

// Ensure edit form works
function setupEditListener() {
    const editForm = document.getElementById("edit-form");
    if (!editForm) {
        console.warn("⚠ Warning: Edit form element not found. Skipping event listener setup.");
        return;
    }
    
    const statusMessage = document.getElementById("status-message");

    editForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const id = document.getElementById("edit-id").value;
        const newName = document.getElementById("edit-name").value;

        try {
            const { error } = await window.supabase.from("test_entries").update({ name: newName }).eq("id", id);
            if (error) throw error;
            
            statusMessage.textContent = "✅ Entry updated successfully!";
            editForm.style.display = "none";
            fetchTestData(); // Refresh the list
        } catch (error) {
            console.error("❌ Error updating data:", error);
            statusMessage.textContent = "Failed to update entry.";
        }
    });
}
