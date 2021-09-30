/* eslint-disable */
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const registerBtn = document.querySelector("#registerBtn");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const message = document.querySelector("#message");

console.log(document.cookie);

const handle = (action) => (evt) => {
  evt.preventDefault();
  const credentials = {
    username: usernameInput.value,
    password: passwordInput.value,
  };
  fetch(`/api/auth/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      message.textContent = data.message;
    })
    .catch((err) => {
      message.textContent = err.message;
    });
};

const logout = (evt) => {
  evt.preventDefault();
  fetch(`/api/auth/logout`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      message.textContent = data.message;
    })
    .catch((err) => {
      message.textContent = err.message;
    });
};

registerBtn.addEventListener("click", handle("register"));
loginBtn.addEventListener("click", handle("login"));
logoutBtn.addEventListener("click", logout);
