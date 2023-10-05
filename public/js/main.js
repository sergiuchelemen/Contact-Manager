// redirect to /add
const addButton = document.querySelector("#add");
addButton.addEventListener("click", () => {
  window.location.href = "http://localhost:3000/user/add";
});

// DELETE request
const deleteButtons = document.querySelectorAll(".delete-button");
const parenClass = document.querySelector(".main-content");

deleteButtons.forEach(function (button) {
  button.addEventListener("click", () => {
    const contactItem = button.closest(".contact-item");

    const elements = contactItem.querySelectorAll(".contact-info");
    const contactFirstName = elements[0];
    // .replace(/\s/g, "")
    // .substring(9);
    const contactLastName = elements[1].textContent
      .replace(/\s/g, "")
      .substring(8);
    const contactEmail = elements[2].textContent
      .replace(/\s/g, "")
      .substring(5);
    const contactPhone = elements[3].textContent
      .replace(/\s/g, "")
      .substring(11);
    const requestBody = {
      firstname: contactFirstName,
      lastname: contactLastName,
      email: contactEmail,
      phone: contactPhone,
    };

    console.log(requestBody.firstname);

    // request
    fetch("http://localhost:3000/user", {
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

  // open modal
  button.addEventListener("click", () => {
    modal.show();
    const elements = contactItem.querySelectorAll(".contact-info");
    const contactFirstName = elements[0].textContent
      .replace(/\s/g, "")
      .substring(9);
    const contactLastName = elements[1].textContent
      .replace(/\s/g, "")
      .substring(8);
    const contactEmail = elements[2].textContent
      .replace(/\s/g, "")
      .substring(5);
    const contactPhone = elements[3].textContent
      .replace(/\s/g, "")
      .substring(11);
    const form = modal.querySelector("#edit-form");

    // current data
    const currentData = {
      firstname: (form.querySelector("#firstname").value = contactFirstName), // fill the form inputs with initial data
      lastname: (form.querySelector("#lastname").value = contactLastName),
      email: (form.querySelector("#email").value = contactEmail),
      phone: (form.querySelector("#phone").value = contactPhone),
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
      fetch("http://localhost:3000/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "User modified") {
            location.reload(true);
          } else {
            alert(data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // close the modal
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

  contactItems.forEach((contactItem) => {
    const firstName = contactItem
      .querySelector(".contact-info:first-of-type")
      .textContent.replace(/\s/g, "")
      .substring(9)
      .toLowerCase();

    const lastname = contactItem
      .querySelector(".contact-info:nth-child(2)")
      .textContent.replace(/\s/g, "")
      .substring(8)
      .toLowerCase();

    if (firstName.includes(searchTerm) || lastname.includes(searchTerm)) {
      contactItem.classList.remove("contact-item-remove");
    } else {
      contactItem.classList.add("contact-item-remove");
    }
  });
});
