import axios from "axios";
import { showAlert } from "./alerts";

export const deleteReview = async (reviewId) => {
    try {
        const res = await axios.delete(
            `http://localhost:8000/api/review/${reviewId}`,
            {
                headers: {
                    Authorization: user,
                },
                data: {
                    reviewId,
                },
            }
        );

        showAlert("success", "Review deleted successfully");
        location.reload();

        // if (res.data.status === "success") {
        //     showAlert("success", "Review deleted successfully");
        //     window.setTimeout(() => {
        //         location.reload();
        //     }, 200);
        // }
    } catch (error) {
        showAlert("danger", error.response.data.message);
        // console.log(error.response.data);
    }
};

export const updateReview = async (review, rating, reviewId) => {
    try {
        const res = await axios({
            method: "PATCH",
            url: `http://localhost:8000/api/review/${reviewId}`,
            data: {
                review,
                rating,
            },
        });
        if (res.data.status === "Success") {
            location.reload();
            showAlert("success", "Review updated successfully!");
        }
    } catch (error) {
        showAlert("danger", error.response.data.message);
    }
};

export const createReview = async (data) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:8000/api/review",
            data,
        });

        if (res.data.status === "Success") {
            location.reload();
            showAlert("success", "Review created successfully!");
        }
    } catch (error) {
        showAlert("danger", error.response.data.message);
    }
};
