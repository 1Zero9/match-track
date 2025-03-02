// ✅ Wait for Supabase to be ready
document.addEventListener("DOMContentLoaded", checkAuth);

// ✅ Check if User is Logged In
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        console.log("✅ User logged in:", user);
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("signup-container").classList.add("hidden");
        document.getElementById("setup-container").classList.remove("hidden");
    } else {
        console.log("❌ No user logged in.");
        document.getElementById("login-container").classList.remove("hidden");
        document.getElementById("setup-container").classList.add("hidden");
    }
}

// ✅ Login Function
document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert("❌ Login failed: " + error.message);
    } else {
        console.log("✅ Login successful");
        checkAuth();
    }
});

// ✅ Signup Function
document.getElementById("signup-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
        alert("❌ Signup failed: " + error.message);
    } else {
        alert("✅ Signup successful! Please log in.");
        showLogin();
    }
});

// ✅ Logout Function
async function logout() {
    await supabase.auth.signOut();
    location.reload();
}
