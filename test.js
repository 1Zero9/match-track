// Ensure Supabase library is loaded
if (typeof window.supabase === "undefined") {
    document.write('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"><\/script>');
}

// Wait for the Supabase library to load before initializing
window.addEventListener("load", async () => {
    console.log("Initializing Supabase...");

    const SUPABASE_URL = "https://tdocwsnhtwpqprqcrxro.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb2N3c25odHdwcXBycWNyeHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzc4ODIsImV4cCI6MjA1NTkxMzg4Mn0.f3bdQMdJAQaxMVqml2qdTxtweV1tD6dgAO8PgHnX9EQ";
    
    // Ensure Supabase is initialized correctly
    window.supabase = window.supabase || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase initialized.");

    const list = document.getElementById("test-data");
    list.innerHTML = "Loading...";

    try {
        const { data, error } = await window.supabase.from("test_entries").select("*");
        if (error) throw error;
        list.innerHTML = data.map(entry => `<li>${entry.name} - ${entry.created_at}</li>`).join("");
    } catch (error) {
        console.error("Error fetching data:", error);
        list.innerHTML = "Failed to load data.";
    }
});
