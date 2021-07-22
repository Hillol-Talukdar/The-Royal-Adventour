import axios from "axios";
import { showAlert } from "./alerts";

export const updateTour = async (data, tourId) => {
    try {
        const res = await axios({
            method: "PATCH",
            url: `http://localhost:8000/api/tour/${tourId}`,
            data,
        });

        if (res.data.status === "Success") {
            location.assign("/manage-tours");
            showAlert("success", "Tour updated successfully!");
        }
    } catch (error) {
        showAlert("danger", error.response.data.message);
    }
};

export const createTour = async (data) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:8000/api/tour",
            data,
        });

        if (res.data.status === "Success") {
            location.assign("/manage-tours");
            showAlert("success", "Tour created successfully!");
        }
    } catch (error) {
        showAlert("danger", error.response.data.message);
    }
};
