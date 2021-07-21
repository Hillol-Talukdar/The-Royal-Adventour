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
