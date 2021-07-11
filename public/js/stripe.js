import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(`${process.env.STRIPE_PUBLIC_KEY}`);

export const bookTour = async (tourId) => {
    try {
        const session = await axios(
            `http://localhost:8000/api/booking/checkout-session/${tourId}`
        );
        // console.log(session);

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (error) {
        showAlert("danger", error);
    }
};
