// ✅ Ensure authentication only runs when Supabase is ready
document.addEventListener("supabaseReady", checkAuth);

async function checkAuth() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            console.log("✅ User is logged in:", user);
        } else {
            console.warn("❌ No user logged in.");
        }
    } catch (error) {
        console.error("❌ Error checking authentication:", error);
    }
}


// ✅ Check if the user is logged in
async function checkAuth() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            console.log("✅ User is logged in:", user);

            // ✅ Update UI based on login status
            if (document.getElementById("login-container")) {
                document.getElementById("login-container").classList.add("hidden");
            }
            if (document.getElementById("signup-container")) {
                document.getElementById("signup-container").classList.add("hidden");
            }
            if (document.getElementById("setup-container")) {
                document.getElementById("setup-container").classList.remove("hidden");
            }
        } else {
            console.warn("❌ No user logged in.");

            // ✅ Redirect to login page if user is required
            if (window.location.pathname.includes("admin.html") || window.location.pathname.includes("setup.html")) {
                window.location.href = "login.html";
            }
        }
    } catch (error) {
        console.error("❌ Error checking authentication:", error);
    }
}

// ✅ Login Function
document.getElementById("login-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert("❌ Login failed: " + error.message);
        } else {
            console.log("✅ Login successful");
            window.location.href = "index.html"; // Redirect on success
        }
    } catch (error) {
        console.error("❌ Error during login:", error);
    }
});

// ✅ Signup Function
document.getElementById("signup-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert("❌ Signup failed: " + error.message);
        } else {
            alert("✅ Signup successful! Please log in.");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("❌ Error during signup:", error);
    }
});

// ✅ Logout Function
async function logout() {
    try {
        await supabase.auth.signOut();
        console.log("✅ Logged out successfully");
        window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
        console.error("❌ Error during logout:", error);
    }
}
