// redirect to /add
const addButton = document.querySelector("#add");
addButton.addEventListener("click", () => {
  window.location.href = "/user/add";
});

// DELETE request
const deleteButtons = document.querySelectorAll(".delete-button");
const parenClass = document.querySelector(".main-content");

deleteButtons.forEach(function (button) {
  button.addEventListener("click", () => {
    const contactItem = button.closest(".contact-item");

    const elements = contactItem.querySelectorAll(".contact-info");
    const contactFirstName = elements[0].querySelector(":nth-child(2)");
    const contactLastName = elements[1].querySelector(":nth-child(2)");
    const contactEmail = elements[2].querySelector(":nth-child(2)");
    const contactPhone = elements[3].querySelector(":nth-child(2)");
    const requestBody = {
      firstname: contactFirstName.textContent.trim(),
      lastname: contactLastName.textContent.trim(),
      email: contactEmail.textContent.trim(),
      phone: contactPhone.textContent.trim(),
    };

    // request
    fetch("/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User deleted") {
          contactItem.remove();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// PUT request
const editButtons = document.querySelectorAll(".edit-button");

editButtons.forEach((button) => {
  const contactItem = button.closest(".contact-item");
  const modal = contactItem.querySelector("[data-modal]");

  button.addEventListener("click", () => {
    // open modal
    modal.show();
    const elements = contactItem.querySelectorAll(".contact-info");
    const contactFirstName = elements[0].querySelector(":nth-child(2)");
    const contactLastName = elements[1].querySelector(":nth-child(2)");
    const contactEmail = elements[2].querySelector(":nth-child(2)");
    const contactPhone = elements[3].querySelector(":nth-child(2)");
    const form = modal.querySelector("#edit-form");

    // current data
    const currentData = {
      // fill the form inputs with initial data
      firstname: (form.querySelector("#firstname").value =
        contactFirstName.textContent.trim()),
      lastname: (form.querySelector("#lastname").value =
        contactLastName.textContent.trim()),
      email: (form.querySelector("#email").value =
        contactEmail.textContent.trim()),
      phone: (form.querySelector("#phone").value =
        contactPhone.textContent.trim()),
    };

    // submit form
    const saveButton = modal.querySelector("#save-button");
    saveButton.addEventListener("click", (event) => {
      event.preventDefault();
      // modified data
      const modifiedData = {
        firstname: form.querySelector("#firstname").value,
        lastname: form.querySelector("#lastname").value,
        email: form.querySelector("#email").value,
        phone: form.querySelector("#phone").value,
      };
      const requestBody = {
        currentData: currentData,
        modifiedData: modifiedData,
      };
      // request
      fetch("/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "User modified") {
            contactFirstName.textContent = modifiedData.firstname;
            contactLastName.textContent = modifiedData.lastname;
            contactEmail.textContent = modifiedData.email;
            contactPhone.textContent = modifiedData.phone;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      modal.close();
    });

    // close modal
    const closeModal = modal.querySelector("[data-close-modal]");
    closeModal.addEventListener("click", () => {
      modal.close();
    });
  });
});

// search bar
const searchBar = document.querySelector(".search-bar");
const contactItems = document.querySelectorAll(".contact-item");

searchBar.addEventListener("input", function () {
  const searchTerm = searchBar.value.toLowerCase();

  contactItems.forEach((item) => {
    const firstname = item
      .querySelector(".contact-info:nth-child(1) p")
      .textContent.trim()
      .toLowerCase();
    const lastname = item
      .querySelector(".contact-info:nth-child(2) p")
      .textContent.trim()
      .toLowerCase();
    if (firstname.includes(searchTerm) || lastname.includes(searchTerm)) {
      item.classList.remove("contact-item-remove");
    } else {
      item.classList.add("contact-item-remove");
    }
  });
});
