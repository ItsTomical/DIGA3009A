// -----------------------------
// Booking Page Logic
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Initialize EmailJS (use your public key)
  emailjs.init("pDeF5q_6RjbGgwM8o");

  const steps = Array.from(document.querySelectorAll(".form-step"));
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");
  let current = 0;

  // Step 1 form inputs
  const bookingForm = document.getElementById("bookingForm");
  const continueBtn = document.getElementById("continueBtn");
  const serviceRadios = Array.from(document.querySelectorAll('input[name="service"]'));
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  // Step 2 & 3 controls
  const prevBtns = Array.from(document.querySelectorAll(".prevBtn"));
  const nextBtn = document.querySelector(".nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  // Step 2 fields
  const careInfo = document.getElementById("careInfo");
  const behaviour = document.getElementById("behaviour");
  const dailyNotes = document.getElementById("dailyNotes");
  const feeding = document.getElementById("feeding");
  const tasks = document.getElementById("tasks");
  const petPhoto = document.getElementById("petPhoto");
  const security = document.getElementById("security");
  const alarms = document.getElementById("alarms");

  // Step 3 summary elements
  const summaryBox = document.getElementById("summaryBox");
  const pricingInfo = document.getElementById("pricingInfo");

  // Pet Fields
  const otherPetField = document.getElementById("otherPetField");
  const otherPetInput = document.getElementById("otherPet");

  // --- Progress Bar + Step Display ---
  function showStep(index) {
    steps.forEach((s, i) => s.classList.toggle("active", i === index));
    current = index;
    const progressPercent = ((index + 1) / steps.length) * 100;
    progressFill.style.width = progressPercent + "%";
    progressLabel.textContent = `Step ${index + 1} of ${steps.length}`;
    if (index === 2) buildSummary();
  }

  // --- Step 1 Validation ---
  function validateStep1() {
    const serviceSelected = serviceRadios.some(r => r.checked);
    const nameOk = nameInput.value.trim().length > 1;
    const emailOk = emailInput.value.trim().includes("@");
    const phoneOk = phoneInput.value.trim().length >= 7;
    const dateOk = document.getElementById("date").value.trim().length > 0;

    // Pets validation
    let petsTotal = 0;
    document.querySelectorAll(".pet-row .count").forEach(c => {
      petsTotal += parseInt(c.textContent);
    });
    const petsOk = petsTotal > 0;

    const allValid = serviceSelected && nameOk && emailOk && phoneOk && dateOk && petsOk;
    continueBtn.disabled = !allValid;
    continueBtn.classList.toggle("enabled", allValid);
  }

  serviceRadios.forEach(r => r.addEventListener("change", validateStep1));
  [nameInput, emailInput, phoneInput].forEach(el => el.addEventListener("input", validateStep1));
  document.getElementById("date").addEventListener("change", validateStep1);

  // --- Step Navigation ---
  continueBtn.addEventListener("click", () => {
    if (!continueBtn.disabled) {
      showStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  prevBtns.forEach(btn => btn.addEventListener("click", () => {
    if (current > 0) {
      showStep(current - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }));

  nextBtn.addEventListener("click", () => {
    showStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- Step 2 Accordion ---
  const detailsElems = document.querySelectorAll("#step2 details");
  detailsElems.forEach(detail => {
    detail.addEventListener("toggle", () => {
      if (detail.open) {
        detailsElems.forEach(other => {
          if (other !== detail) other.open = false;
        });
      }
    });
  });

  // --- Step 3 Summary ---
  function buildSummary() {
    const service = (serviceRadios.find(r => r.checked) || {}).value || "—";
    const name = nameInput.value || "—";
    const email = emailInput.value || "—";
    const phone = phoneInput.value || "—";
    const date = document.getElementById("date").value || "—";
    const notes = document.getElementById("notes").value || "—";

    let petsSummary = [];
    document.querySelectorAll(".pet-row").forEach(row => {
      const type = row.dataset.type;
      const count = parseInt(row.querySelector(".count").textContent, 10);
      if (count > 0) {
        let label = type;
        if (type === "Other") {
          const otherType = (document.getElementById("otherPet").value || "").trim();
          if (otherType) label += ` (${otherType})`;
        }
        petsSummary.push(`${label} × ${count}`);
      }
    });
    const pet = petsSummary.length ? petsSummary.join(", ") : "—";

    const uploaded = petPhoto?.files?.length ? "Yes" : "No";
    const sec = security.checked ? "Yes" : "No";
    const alm = alarms.checked ? "Yes" : "No";

    summaryBox.innerHTML = `
      <div><strong>Service:</strong> ${service}</div>
      <div><strong>Name:</strong> ${name}</div>
      <div><strong>Email:</strong> ${email}</div>
      <div><strong>Phone:</strong> ${phone}</div>
      <div><strong>Date:</strong> ${date}</div>
      <div><strong>Pets:</strong> ${pet}</div>
      <div><strong>Additional Notes:</strong> ${notes}</div>
      <hr />
      <div><strong>Care Info:</strong> ${careInfo.value || "—"}</div>
      <div><strong>Behaviour:</strong> ${behaviour.value || "—"}</div>
      <div><strong>Daily Notes:</strong> ${dailyNotes.value || "—"}</div>
      <div><strong>Feeding:</strong> ${feeding.value || "—"}</div>
      <div><strong>Tasks:</strong> ${tasks.value || "—"}</div>
      <div><strong>Security:</strong> ${sec} &nbsp; <strong>Alarms:</strong> ${alm}</div>
      <div><strong>Pet photo uploaded:</strong> ${uploaded}</div>
    `;

    pricingInfo.innerHTML = `
      <p>Service fee: $XX</p>
      <p>Additional notes: ${notes}</p>
    `;
  }

  // --- Confirm Booking (Send Email via EmailJS) ---
  const bookingConfirmed = document.getElementById("bookingConfirmed");

  submitBtn.addEventListener("click", () => {
    const service = (serviceRadios.find(r => r.checked) || {}).value || "—";
    const name = nameInput.value || "—";
    const email = emailInput.value || "—";
    const phone = phoneInput.value || "—";
    const date = document.getElementById("date").value || "—";
    const notes = document.getElementById("notes").value || "—";

    let petsSummary = [];
    document.querySelectorAll(".pet-row").forEach(row => {
      const type = row.dataset.type;
      const count = parseInt(row.querySelector(".count").textContent, 10);
      if (count > 0) {
        let label = type;
        if (type === "Other") {
          const otherType = (document.getElementById("otherPet").value || "").trim();
          if (otherType) label += ` (${otherType})`;
        }
        petsSummary.push(`${label} × ${count}`);
      }
    });
    const pet = petsSummary.length ? petsSummary.join(", ") : "—";

    const emailData = {
      service,
      name,
      email,
      phone,
      date,
      pets: pet,
      notes,
      care_info: careInfo.value || "—",
      behaviour: behaviour.value || "—",
      daily_notes: dailyNotes.value || "—",
      feeding: feeding.value || "—",
      tasks: tasks.value || "—",
      security: security.checked ? "Yes" : "No",
      alarms: alarms.checked ? "Yes" : "No",
    };

    // Send booking email
    emailjs.send("service_tvt2d89", "template_yqhts3q", emailData)
      .then(() => {
        document.getElementById("step3").style.display = "none";
        bookingConfirmed.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert("❌ Something went wrong sending the booking email. Please try again.");
      });
  });

  // --- New Booking Button ---
  const newBookingBtn = document.getElementById("newBookingBtn");
  newBookingBtn.addEventListener("click", () => {
    bookingForm.reset();
    [careInfo, behaviour, dailyNotes, feeding, tasks].forEach(f => f.value = "");
    if (petPhoto) petPhoto.value = "";
    validateStep1();
    bookingConfirmed.style.display = "none";
    showStep(0);
  });

  // --- Always-visible Pet Rows ---
  document.querySelectorAll(".pet-row").forEach(row => {
    const plus = row.querySelector(".plus");
    const minus = row.querySelector(".minus");
    const countEl = row.querySelector(".count");
    const type = row.dataset.type;

    // Prevent double bindings
    plus.replaceWith(plus.cloneNode(true));
    minus.replaceWith(minus.cloneNode(true));

    const newPlus = row.querySelector(".plus");
    const newMinus = row.querySelector(".minus");

    newPlus.addEventListener("click", () => {
      let newCount = parseInt(countEl.textContent) + 1;
      countEl.textContent = newCount;

      if (type === "Other") {
        if (newCount > 0) {
          otherPetField.classList.remove("hidden");
          otherPetInput.required = true;
          otherPetInput.focus();
        }
      }

      validateStep1();
      updatePetHighlight(row);
    });

    newMinus.addEventListener("click", () => {
      const current = parseInt(countEl.textContent);
      const newCount = current > 0 ? current - 1 : 0;
      countEl.textContent = newCount;

      if (type === "Other" && newCount === 0) {
        otherPetField.classList.add("hidden");
        otherPetInput.required = false;
        otherPetInput.value = "";
      }

      validateStep1();
      updatePetHighlight(row);
    });
  });

  // --- Optional: Highlight selected pet boxes ---
  function updatePetHighlight(row) {
    const count = parseInt(row.querySelector(".count").textContent);
    if (count > 0) {
      row.classList.add("selected");
    } else {
      row.classList.remove("selected");
    }
  }

  // --- Flatpickr Setup ---
  flatpickr("#date", {
    mode: "multiple",
    dateFormat: "Y-m-d",
    minDate: "today",
    altInput: true,
    altFormat: "F j, Y",
  });

  // Initialize
  validateStep1();
  showStep(0);
});
