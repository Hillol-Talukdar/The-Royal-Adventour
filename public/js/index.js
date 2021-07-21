import "@babel/polyfill";
import { signup } from "./signup";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { deleteReview } from "./review";

// DOM elements
// to prevent running in all pages
const mapBox = document.getElementById("map");
const signupForm = document.querySelector("#signup-form");
const loginForm = document.querySelector("#login-form");
const logoutBtn = document.querySelector("#logout");
const userDataForm = document.querySelector("#userDataForm");
const userPasswordForm = document.querySelector("#userPasswordForm");
const bookButton = document.getElementById("book-tour");
const deleteReviewButton = document.getElementById("deleteReviewBtn");

// Delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);

    displayMap(locations);
}

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        document.querySelector("#signupBtn").textContent = "Processing...";

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        signup(name, email, password, confirmPassword);
    });
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

        const form = new FormData();
        form.append("name", document.getElementById("name").value);
        form.append("email", document.getElementById("email").value);
        form.append("photo", document.getElementById("photo").files[0]);

        updateSettings(form, "data");
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

if (bookButton) {
    bookButton.addEventListener("click", (e) => {
        e.target.textContent = "Processing...";

        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}

if (deleteReviewButton) {
    deleteReviewButton.addEventListener("click", (e) => {
        e.preventDefault();

        e.target.textContent = "Processing...";

        const { reviewId } = e.target.dataset;
        deleteReview(reviewId);
    });
}
