import axios from "axios";
import { showAlert } from "./alerts";

// type= password or data
export const updateTour = async (data, tourId) => {
    try {
        const res = await axios({
            method: "PATCH",
            url: `http://localhost:8000/api/tour/${tourId}`,
            data,
        });

        if (res.data.status === "success") {
            location.assign("/");
            showAlert("success", "Tour updated successfully!");
        }
    } catch (error) {
        showAlert("danger", error.response.data.message);
    }
};
