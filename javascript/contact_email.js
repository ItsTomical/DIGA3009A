// contact_email.js
// Handles the contact form email sending via EmailJS

document.addEventListener("DOMContentLoaded", () => {
  // Initialize EmailJS
  emailjs.init("pDeF5q_6RjbGgwM8o"); // e.g. public_AbC123XYZ

  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      emailjs.sendForm("service_tvt2d89", "template_x2ff96a", contactForm)
        .then(() => {
          alert("🐾 Message sent successfully! I’ll get back to you soon.");
          contactForm.reset();
        })
        .catch((error) => {
          console.error("EmailJS error:", error);
          alert("Oops, something went wrong. Please try again later.");
        });
    });
  }
});
