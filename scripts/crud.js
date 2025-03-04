// ✅ Fetch existing items and populate the table
async function fetchItems(table) {
    try {
        const { data, error } = await supabase.from(table).select("*");

        if (error) throw error;

        console.log(`✅ Fetched ${table}:`, data);

        const tbody = document.getElementById(`${table}-table-body`);
        if (!tbody) {
            console.warn(`⚠ Table body for ${table} not found.`);
            return;
        }

        tbody.innerHTML = ""; // Clear existing content

        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>
                    <button class="edit-button" onclick="editItem('${table}', ${item.id}, '${item.name}')">✏ Edit</button>
                    <button class="delete-button" onclick="deleteItem('${table}', ${item.id})">🗑 Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error(`❌ Error fetching ${table}:`, error);
    }
}

// ✅ Insert New Item
async function insertItem(table) {
    const itemName = document.getElementById(`${table}-name`).value.trim();
    if (!itemName) {
        alert("❌ Please enter a name!");
        return;
    }

    try {
        const { error } = await supabase.from(table).insert([{ name: itemName }]);

        if (error) throw error;

        console.log(`✅ ${itemName} added to ${table}`);
        fetchItems(table); // Refresh list
        document.getElementById(`${table}-name`).value = ""; // Clear input
    } catch (error) {
        console.error(`❌ Error inserting into ${table}:`, error);
    }
}

// ✅ Edit an item (Prompt for new name)
function editItem(table, id, currentName) {
    const newName = prompt("Enter new name:", currentName);
    if (newName && newName !== currentName) {
        updateItem(table, id, newName);
    }
}

// ✅ Update an item in the database
async function updateItem(table, id, newName) {
    try {
        const { error } = await supabase.from(table).update({ name: newName }).eq("id", id);

        if (error) throw error;

        console.log(`✅ Updated item in ${table}: ${newName}`);
        fetchItems(table); // Refresh list
    } catch (error) {
        console.error(`❌ Error updating ${table}:`, error);
    }
}

// ✅ Delete an item from the database
async function deleteItem(table, id) {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
        const { error } = await supabase.from(table).delete().eq("id", id);

        if (error) throw error;

        console.log(`✅ Deleted item from ${table}`);
        fetchItems(table); // Refresh list
    } catch (error) {
        console.error(`❌ Error deleting from ${table}:`, error);
    }
}

// ✅ Populate Match Form Dropdowns
async function populateMatchForm() {
    await populateDropdown("teams", "home-team");
    await populateDropdown("teams", "away-team");
    await populateDropdown("competitions", "competition");
}

// ✅ Fetch and populate dropdowns
async function populateDropdown(table, elementId) {
    try {
        const { data, error } = await supabase.from(table).select("name, id");

        if (error) throw error;

        const dropdown = document.getElementById(elementId);
        if (!dropdown) return;

        dropdown.innerHTML = `<option value="">Select...</option>`; // Default option
        data.forEach(item => {
            dropdown.innerHTML += `<option value="${item.id}">${item.name}</option>`;
        });

        console.log(`✅ Populated ${elementId} dropdown.`);
    } catch (error) {
        console.error(`❌ Error fetching ${table}:`, error);
    }
}

// ✅ Attach event listeners when page loads
document.addEventListener("DOMContentLoaded", () => {
    ["teams", "venues", "competitions"].forEach(table => {
        const form = document.getElementById(`${table}-form`);
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                insertItem(table);
            });
        }

        fetchItems(table); // Load table data
    });

    // ✅ Load dropdowns for match form
    populateMatchForm();
});
