// ✅ Custom Login Supporting Username or Email
async function login(event) {
    event.preventDefault();

    const identifier = document.getElementById("identifier").value.trim(); // Can be email or username
    const password = document.getElementById("password").value.trim();

    if (!identifier || !password) {
        showError("Please enter a username/email and password.");
        return;
    }

    try {
        // ✅ Query Supabase for either email or username
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .or(`username.eq.${identifier},email.eq.${identifier}`)
            .eq("password", password)
            .single();

        if (error || !data) {
            showError("Invalid username/email or password.");
            return;
        }

        console.log("✅ Login successful:", data);

        // ✅ Store user details in sessionStorage (to simulate authentication)
        sessionStorage.setItem("user", JSON.stringify(data));

        // ✅ Redirect to homepage or admin page based on role
        if (data.role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("❌ Login Error:", error);
        showError("Login failed. Please try again.");
    }
}

// ✅ Show error messages
function showError(message) {
    document.getElementById("error-message").textContent = message;
}

// ✅ Logout Function (Clears session)
function logout() {
    sessionStorage.removeItem("user");
    window.location.href = "login.html";
}

// ✅ Redirect to login if not authenticated
function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
        console.warn("❌ No user logged in. Redirecting to login...");
        window.location.href = "login.html";
    } else {
        console.log("✅ User authenticated:", user);
    }
}

// ✅ Attach event listener for login form
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }
});
