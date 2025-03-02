
// ✅ Ensure Supabase SDK is loaded
if (typeof window.supabase === "undefined") {
    console.log("🚀 Loading Supabase SDK...");
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";
    script.onload = () => {
        console.log("✅ Supabase SDK loaded.");
        initializeSupabase();  // Run initialization after loading
    };
    document.head.appendChild(script);
} else {
    console.log("⚠ Supabase SDK already loaded.");
    initializeSupabase();
}

// ✅ Function to Initialize Supabase
function initializeSupabase() {
    if (typeof supabase === "undefined") {
        console.error("❌ Supabase SDK failed to load.");
        return;
    }

    const SUPABASE_URL = "https://ozsraoyortbvkckymdll.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96c3Jhb3lvcnRidmtja3ltZGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjE3NzgsImV4cCI6MjA1NjMzNzc3OH0.va3ZxmhrHsHC_T5WwiUr1n6i8euftfW-NDBbCQaAS9Q"; // 🔹 Replace this with your correct key

    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase Initialized and Ready.");
}
