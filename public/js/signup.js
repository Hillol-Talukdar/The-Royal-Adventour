import axios from "axios";
import { showAlert } from "./alerts";

export const signup = async (name, email, password, confirmPassword) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:8000/api/user/signup",
            data: {
                name,
                email,
                password,
                confirmPassword,
            },
        });

        if (res.data.status === "success") {
            showAlert("success", "Signed up successfully");
            location.assign("/");
        }
    } catch (error) {
        showAlert("danger", error.response.data.message);
        // console.log(error.response.data);
    }
};
