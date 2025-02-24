// Initialize Supabase
const SUPABASE_URL = "https://tdocwsnhtwpqprqcrxro.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb2N3c25odHdwcXBycWNyeHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzc4ODIsImV4cCI6MjA1NTkxMzg4Mn0.f3bdQMdJAQaxMVqml2qdTxtweV1tD6dgAO8PgHnX9EQ";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const list = document.getElementById("test-data");
    list.innerHTML = "Loading...";

    try {
        const { data, error } = await supabase.from("test_entries").select("*");
        
        if (error) throw error;
        
        list.innerHTML = data.map(entry => `<li>${entry.name} - ${entry.created_at}</li>`).join("");
    } catch (error) {
        console.error("Error fetching data:", error);
        list.innerHTML = "Failed to load data.";
    }
});
