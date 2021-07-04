const login = async (email, password) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:8000/api/user/login",
            data: {
                email,
                password,
            },
        });

        console.log(res);
    } catch (error) {
        // console.log(error.response.data);
        console.log(error);
    }
};

document.querySelector("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
});
