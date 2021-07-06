import axios from "axios";
import { showAlert } from "./alerts";

// type= password or data
export const updateSettings = async (data, type) => {
    try {
        const url =
            type === "password"
                ? "http://localhost:8000/api/user/updatePassword"
                : "http://localhost:8000/api/user/updateMe";

        const res = await axios({
            method: "PATCH",
            url,
            data,
        });

        if (res.data.status === "success") {
            showAlert("success", `${type.toUpperCase()} updated successfully!`);
        }
    } catch (error) {
        showAlert("danger", error.response.data.message);
    }
};
