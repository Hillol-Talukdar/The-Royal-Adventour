import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";

// DOM elements
// to prevent running in all pages
const mapBox = document.getElementById("map");
const loginForm = document.querySelector("#login-form");
const logoutBtn = document.querySelector("#logout");
const userDataForm = document.querySelector("#userDataForm");
const userPasswordForm = document.querySelector("#userPasswordForm");

// Delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);

    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        login(email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

if (userDataForm) {
    userDataForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        updateSettings({ name, email }, "data");
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        document.querySelector("#savePasswordBtn").textContent = "Updating...";

        const currentPassword =
            document.getElementById("currentPassword").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        await updateSettings(
            { currentPassword, password, confirmPassword },
            "password"
        );

        document.querySelector("#savePasswordBtn").textContent =
            "Save password";
        document.getElementById("password-current").value = "";
        document.getElementById("password").value = "";
        document.getElementById("password-confirm").value = "";
    });
}
