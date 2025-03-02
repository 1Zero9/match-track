// ✅ Fetch Existing Items for CRUD Table
async function fetchItems(table) {
    const { data, error } = await window.supabase.from(table).select("*");

    if (error) {
        console.error(`❌ Error fetching ${table}:`, error);
        return;
    }

    const tbody = document.getElementById("resultsTableBody");
    tbody.innerHTML = '';

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
}

// ✅ Handle Form Submission (Create)
document.getElementById("setup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const itemName = document.getElementById("setup-name").value;
    insertItem(selectedTable, itemName);
});

// ✅ Add New Item to Database
async function insertItem(table, itemName) {
    const { error } = await window.supabase.from(table).insert([{ name: itemName }]);
    if (error) {
        console.error(`❌ Error inserting into ${table}:`, error);
        return;
    }
    fetchItems(table);
    document.getElementById("setup-name").value = "";
}

// ✅ Edit an Item
function editItem(table, id, currentName) {
    const newName = prompt("Enter new name:", currentName);
    if (newName && newName !== currentName) {
        updateItem(table, id, newName);
    }
}

async function updateItem(table, id, newName) {
    const { error } = await window.supabase.from(table).update({ name: newName }).eq("id", id);
    if (error) {
        console.error(`❌ Error updating ${table}:`, error);
        return;
    }
    fetchItems(table);
}

// ✅ Delete an Item
async function deleteItem(table, id) {
    if (!confirm("Are you sure you want to delete this?")) return;
    const { error } = await window.supabase.from(table).delete().eq("id", id);
    if (error) {
        console.error(`❌ Error deleting from ${table}:`, error);
        return;
    }
    fetchItems(table);
}
