// password field text style
const passwordIcon = document.querySelector(".bxs-lock-alt");
const passwordField = document.querySelector(".password-input");

passwordIcon.addEventListener("click", () => {
  passwordIcon.classList.toggle("bxs-lock-open-alt");
  if (passwordField.type === "text") {
    passwordField.type = "password";
  } else {
    passwordField.type = "text";
  }
});

// copyright non-hardcoded year
const copyrightYear = document.querySelector(".copyright span");
const date = new Date();
copyrightYear.innerHTML = date.getFullYear();

// form POST request
const errorMessage = document.querySelector(".error-message");
const form = document.querySelector(".form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message == "User already exists") {
        errorMessage.style.display = "block";
      } else {
        window.location.href = data.redirectTo;
      }
    })
    .catch((error) => console.log(error));
});
