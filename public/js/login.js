import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:8000/api/user/login",
            data: {
                email,
                password,
            },
        });

        if (res.data.status === "success") {
            showAlert("success", "logged in successfully");
            window.setTimeout(() => {
                location.assign("/");
            }, 1000);
        }
    } catch (error) {
        showAlert("danger", error.response.data.message);
        // console.log(error.response.data);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "http://localhost:8000/api/user/logout",
        });

        if ((res.data.status = "success")) {
            location.reload();
        }
    } catch (error) {
        showAlert("danger", "Error logging out! Try again.");
    }
};
