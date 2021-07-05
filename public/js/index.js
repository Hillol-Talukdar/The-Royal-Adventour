import "@babel/polyfill";
// import { displayMap } from "./mapbox";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";

// DOM elements
// to prevent running in all pages
const mapBox = document.getElementById("map");
const loginForm = document.querySelector("#login-form");
const logoutBtn = document.querySelector("#logout");

// Delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    // console.log(locations);

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
