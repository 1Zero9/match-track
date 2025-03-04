// ✅ Fetch existing items and populate the table
async function fetchItems(table) {
    try {
        const { data, error } = await supabase.from(table).select("*");

        if (error) throw error;

        console.log(`✅ Fetched ${table}:`, data);

        const tbody = document.getElementById(`${table}-table-body`);
        if (!tbody) return console.warn(`⚠ Table body for ${table} not found.`);

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
        showMessage(`Error loading ${table}.`, "error");
    }
}

// ✅ Add a new item to the database
async function insertItem(table) {
    const itemName = document.getElementById(`${table}-name`).value.trim();
    if (!itemName) {
        showMessage("❌ Please enter a name!", "error");
        return;
    }

    try {
        const { error } = await supabase.from(table).insert([{ name: itemName }]);

        if (error) throw error;

        console.log(`✅ ${itemName} added to ${table}`);
        showMessage(`✅ ${itemName} added successfully!`, "success");
        fetchItems(table); // Refresh list
        document.getElementById(`${table}-name`).value = ""; // Clear input field
    } catch (error) {
        console.error(`❌ Error inserting into ${table}:`, error);
        showMessage(`❌ Failed to add ${itemName}.`, "error");
    }
}

// ✅ Edit an item
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
        showMessage(`✅ ${newName} updated successfully!`, "success");
        fetchItems(table); // Refresh list
    } catch (error) {
        console.error(`❌ Error updating ${table}:`, error);
        showMessage(`❌ Failed to update ${newName}.`, "error");
    }
}

// ✅ Delete an item from the database
async function deleteItem(table, id) {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
        const { error } = await supabase.from(table).delete().eq("id", id);

        if (error) throw error;

        console.log(`✅ Deleted item from ${table}`);
        showMessage(`✅ Item deleted successfully.`, "success");
        fetchItems(table); // Refresh list
    } catch (error) {
        console.error(`❌ Error deleting from ${table}:`, error);
        showMessage(`❌ Failed to delete item.`, "error");
    }
}

// ✅ Show success or error messages
function showMessage(message, type) {
    const messageBox = document.getElementById("message-box");
    if (!messageBox) return console.warn("⚠ Message box not found.");
    
    messageBox.textContent = message;
    messageBox.className = type === "success" ? "success-message" : "error-message";

    // Hide message after 3 seconds
    setTimeout(() => {
        messageBox.textContent = "";
    }, 3000);
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

        fetchItems(table); // Ensure tables load on page load
    });
});
