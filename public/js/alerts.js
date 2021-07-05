export const showAlert = (type, message) => {
    const markup = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
};
