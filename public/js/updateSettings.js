import axios from "axios";
import { showAlert } from "./alerts";

export const updateData = async (name, email) => {
    try {
        const res = await axios({
            method: "PATCH",
            url: "http://localhost:8000/api/user/updateMe",
            data: {
                name,
                email,
            },
        });

        if (res.data.status === "success") {
            showAlert("success", "Data updated successfully!");
        }
    } catch (error) {
        showAlert("danger", error.response.data.message);
    }
};
