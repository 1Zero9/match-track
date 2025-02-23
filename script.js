/* General Styles */
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 350px;
}

h1 {
    margin-bottom: 20px;
    color: #333;
}

label {
    display: block;
    text-align: left;
    font-size: 14px;
    margin-top: 10px;
}

input, select {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

/* Button Styles */
.button {
    background-color: orange;
    color: white;
    border: none;
    padding: 10px;
    width: 100%;
    margin-top: 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s, transform 0.2s;
}

.button:hover {
    background-color: darkorange;
    transform: scale(1.05);
}

.button.secondary {
    background-color: #444;
}

.button.secondary:hover {
    background-color: #666;
}

.button.logout {
    background-color: red;
}

.button.logout:hover {
    background-color: darkred;
}

/* Navigation */
nav {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.nav-btn {
    background-color: #444;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s, transform 0.2s;
}

.nav-btn:hover {
    background-color: #666;
    transform: scale(1.05);
}

.nav-btn.active {
    background-color: orange;
    color: white;
}

/* Forms */
form {
    display: flex;
    flex-direction: column;
}

.error-message {
    color: red;
    margin-top: 10px;
    font-size: 14px;
}

/* Page Specific Containers */
.dashboard-container, .match-log-container, .settings-container {
    max-width: 600px;
    width: 100%;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}