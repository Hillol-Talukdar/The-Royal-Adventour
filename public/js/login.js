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

        if (res.data.status === "success") {
            alert("logged in successfully");
            window.setTimeout(() => {
                location.assign("/");
            }, 1000);
        }
    } catch (error) {
        alert(error.response.message);
        // console.log(error.response.data);
    }
};

document.querySelector("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
});
