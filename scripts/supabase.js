// ✅ Ensure Supabase is globally available
if (typeof window.supabase === "undefined") {
    const SUPABASE_URL = "https://ozsraoyortbvkckymdll.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96c3Jhb3lvcnRidmtja3ltZGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjE3NzgsImV4cCI6MjA1NjMzNzc3OH0.va3ZxmhrHsHC_T5WwiUr1n6i8euftfW-NDBbCQaAS9Q"; // 🔹 Replace this with your correct key

    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase Initialized and Ready to Use.");
} else {
    console.warn("⚠ Supabase is already initialized.");
}