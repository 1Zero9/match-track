// ✅ Fetch existing items and populate the table
async function fetchItems(table) {
    try {
        const { data, error } = await supabase.from(table).select("*");

        if (error) throw error;

        console.log(`✅ Fetched ${table}:`, data);

        const tbody = document.getElementById("resultsTableBody");
        if (!tbody) return;

        tbody.innerHTML = ''; // Clear existing content

        data.forEach(item => {
            const row = document.createElement('tr');
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

// ✅ Add a new item to the database
async function insertItem(table) {
    const itemName = document.getElementById(`${table}-name`).value;
    if (!itemName) return alert("❌ Please enter a name!");

    try {
        const { error } = await supabase.from(table).insert([{ name: itemName }]);

        if (error) throw error;

        console.log(`✅ ${itemName} added to ${table}`);
        fetchItems(table); // Refresh list
        document.getElementById(`${table}-name`).value = ""; // Clear input field
    } catch (error) {
        console.error(`❌ Error inserting into ${table}:`, error);
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
    });
});
