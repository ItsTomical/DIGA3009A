document.addEventListener("DOMContentLoaded", () => {
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

  // --- Progress Bar + Step Display ---
  function showStep(index) {
    steps.forEach((s, i) => s.classList.toggle("active", i === index));
    current = index;

    const progressPercent = ((index + 1) / steps.length) * 100;
    progressFill.style.width = progressPercent + "%";
    progressLabel.textContent = `Step ${index + 1} of ${steps.length}`;

    if (index === 2) buildSummary();
  }

  // --- Validate Step 1 ---
  function validateStep1() {
    const serviceSelected = serviceRadios.some(r => r.checked);
    const nameOk = nameInput.value.trim().length > 1;
    const emailOk = emailInput.value.trim().includes("@");
    const phoneOk = phoneInput.value.trim().length >= 7;
    const allValid = serviceSelected && nameOk && emailOk && phoneOk;

    continueBtn.disabled = !allValid;
    continueBtn.classList.toggle("enabled", allValid);
  }

  serviceRadios.forEach(r => r.addEventListener("change", validateStep1));
  [nameInput, emailInput, phoneInput].forEach(el => el.addEventListener("input", validateStep1));

  continueBtn.addEventListener("click", () => {
    if (!continueBtn.disabled) {
      showStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (current > 0) {
        showStep(current - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  nextBtn.addEventListener("click", () => {
    showStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- Step 2 Accordion ---
  const detailsElems = document.querySelectorAll("#step2 details");
  detailsElems.forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (detail.open) {
        detailsElems.forEach((other) => {
          if (other !== detail) other.open = false;
        });
      }
    });
  });

  // --- Build Summary (Step 3) ---
  function buildSummary() {
    const service = (serviceRadios.find(r => r.checked) || {}).value || "—";
    const name = nameInput.value || "—";
    const email = emailInput.value || "—";
    const phone = phoneInput.value || "—";
    const date = document.getElementById("date").value || "—";
    const special = document.getElementById("special").value || "—";
    const notes = document.getElementById("notes").value || "—";

    // Get pet counts from Wag dropdown
    let petsSummary = [];
    document.querySelectorAll(".pet-row").forEach((row) => {
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

    let uploaded = petPhoto?.files?.length ? "Yes" : "No";

    const sec = security.checked ? "Yes" : "No";
    const alm = alarms.checked ? "Yes" : "No";

    summaryBox.innerHTML = `
      <div><strong>Service:</strong> ${service}</div>
      <div><strong>Name:</strong> ${name}</div>
      <div><strong>Email:</strong> ${email}</div>
      <div><strong>Phone:</strong> ${phone}</div>
      <div><strong>Date:</strong> ${date}</div>
      <div><strong>Pets:</strong> ${pet}</div>
      <div><strong>Special Instructions:</strong> ${special}</div>
      <div><strong>Additional Notes:</strong> ${notes}</div>
      <hr />
      <div><strong>Care Info:</strong> ${careInfo.value || "—"}</div>
      <div><strong>Behaviour:</strong> ${behaviour.value || "—"}</div>
      <div><strong>Daily Notes:</strong> ${dailyNotes.value || "—"}</div>
      <div><strong>Feeding:</strong> ${feeding.value || "—"}</div>
      <div><strong>Tasks:</strong> ${tasks.value || "—"}</div>
      <div><strong>Security info:</strong> ${sec} &nbsp; <strong>Alarms:</strong> ${alm}</div>
      <div><strong>Pet photo uploaded:</strong> ${uploaded}</div>
    `;

    pricingInfo.innerHTML = `
      <p>Service fee: $XX</p>
      <p>Additional notes: ${notes}</p>
    `;
  }

  // --- Confirm booking ---
  submitBtn.addEventListener("click", () => {
    alert("✅ Booking confirmed!\n\nThank you for booking with us.");
    showStep(0);
    bookingForm.reset();
    [careInfo, behaviour, dailyNotes, feeding, tasks].forEach(f => f.value = "");
    if (petPhoto) petPhoto.value = "";
    validateStep1();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Confirmation screen view swap
  const bookingConfirmed = document.getElementById("bookingConfirmed");
  submitBtn.addEventListener("click", () => {
    document.getElementById("step3").style.display = "none";
    bookingConfirmed.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const newBookingBtn = document.getElementById("newBookingBtn");
  newBookingBtn.addEventListener("click", () => {
    bookingForm.reset();
    [careInfo, behaviour, dailyNotes, feeding, tasks].forEach(f => f.value = "");
    if (petPhoto) petPhoto.value = "";
    validateStep1();
    bookingConfirmed.style.display = "none";
    showStep(0);
  });

  // --- Wag-style pet selector dropdown ---
  const petTrigger = document.getElementById("petDropdownTrigger");
  const petDropdown = document.getElementById("petDropdown");
  const petSummaryText = document.getElementById("petSummaryText");
  const otherPetField = document.getElementById("otherPetField");
  const otherPetInput = document.getElementById("otherPet");

  petTrigger.addEventListener("click", () => {
    petDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!petTrigger.contains(e.target) && !petDropdown.contains(e.target)) {
      petDropdown.classList.add("hidden");
    }
  });

  function updatePetSummary() {
    let parts = [];
    document.querySelectorAll(".pet-row").forEach((row) => {
      const type = row.dataset.type;
      const count = parseInt(row.querySelector(".count").textContent, 10);
      if (count > 0) parts.push(`${count} ${type}${count > 1 ? "s" : ""}`);
    });
    petSummaryText.textContent = parts.length ? parts.join(", ") : "Select pets";
  }

  document.querySelectorAll(".pet-row").forEach((row) => {
    const plus = row.querySelector(".plus");
    const minus = row.querySelector(".minus");
    const countEl = row.querySelector(".count");
    const type = row.dataset.type;

    plus.addEventListener("click", () => {
      countEl.textContent = parseInt(countEl.textContent) + 1;
      if (type === "Other") {
        otherPetField.classList.remove("hidden");
        otherPetInput.required = true;
      }
      updatePetSummary();
    });

    minus.addEventListener("click", () => {
      const current = parseInt(countEl.textContent);
      if (current > 0) countEl.textContent = current - 1;

      if (type === "Other" && current - 1 === 0) {
        otherPetField.classList.add("hidden");
        otherPetInput.required = false;
        otherPetInput.value = "";
      }
      updatePetSummary();
    });
  });

  // --- Wag-style date picker ---
  flatpickr("#date", {
    mode: "multiple",
    dateFormat: "Y-m-d",
    minDate: "today",
    altInput: true,
    altFormat: "F j, Y",
  });

  validateStep1();
  showStep(0);
});
