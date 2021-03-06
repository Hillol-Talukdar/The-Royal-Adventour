export const showAlert = (type, message) => {
    const markup = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;

    document.querySelector(".navbar").insertAdjacentHTML("afterend", markup);
    // document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
};
