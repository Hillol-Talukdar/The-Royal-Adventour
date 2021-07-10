import axios from "axios";
const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);

const bookTour = async (tourId) => {
    const session = await axios(
        `http://localhost:8000/api/booking/checkout-session/${tourId}`
    );
    console.log(session);
};
