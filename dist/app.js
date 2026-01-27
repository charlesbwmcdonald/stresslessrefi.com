// app.js
(() => {
  const STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
    "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
    "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
    "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
    "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"
  ];

  // ⚡ Load Officer CRM Form ID
  const FORM_ID = "lU1PmX790LcmntfWobcf";
  const SUBMIT_URL = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`;

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Form elements
  const form = document.getElementById("leadForm");
  const state = document.getElementById("state");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const zip = document.getElementById("zip");
  const phone = document.getElementById("phone");
  const submitBtn = form?.querySelector('button[type="submit"]');

  // Modal (optional)
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modalText");
  const openModal = (txt) => {
    if (!modal) return;
    if (modalText) modalText.textContent = txt;
    modal.setAttribute("aria-hidden", "false");
  };
  const closeModal = () => modal?.setAttribute("aria-hidden", "true");
  modal?.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.getAttribute("aria-hidden") === "false") closeModal();
  });

  // Populate states
  if (state) {
    STATES.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      state.appendChild(opt);
    });
    state.value = "Florida";
  }

  // Zip formatting
  zip?.addEventListener("input", () => {
    zip.value = zip.value.replace(/[^\d-]/g, "").slice(0, 10);
  });

  // Phone formatting (US)
  phone?.addEventListener("input", () => {
    const d = phone.value.replace(/\D/g, "").slice(0, 10);
    if (!d) { phone.value = ""; return; }
    if (d.length < 4) { phone.value = `(${d}`; return; }
    if (d.length < 7) { phone.value = `(${d.slice(0,3)}) ${d.slice(3)}`; return; }
    phone.value = `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  });

  const setErr = (input, msg) => {
    const err = input?.closest(".field")?.querySelector(".err");
    if (err) err.textContent = msg || "";
    if (msg) input?.setAttribute("aria-invalid", "true");
    else input?.removeAttribute("aria-invalid");
  };

  const validate = () => {
    let ok = true;
    
    // Name validation
    if (!name?.value.trim()) { 
      setErr(name, "Required"); 
      ok = false; 
    } else setErr(name, "");
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.value.trim()) {
      setErr(email, "Required");
      ok = false;
    } else if (!emailPattern.test(email.value.trim())) {
      setErr(email, "Enter valid email");
      ok = false;
    } else setErr(email, "");
    
    // State validation
    if (!state?.value) { 
      setErr(state, "Required"); 
      ok = false; 
    } else setErr(state, "");
    
    // Zip validation
    const z = (zip?.value || "").replace(/\D/g, "");
    if (z.length !== 5) { 
      setErr(zip, "Enter 5-digit zip"); 
      ok = false; 
    } else setErr(zip, "");
    
    // Phone validation
    const p = (phone?.value || "").replace(/\D/g, "");
    if (p.length !== 10) { 
      setErr(phone, "Enter 10-digit phone"); 
      ok = false; 
    } else setErr(phone, "");
    
    return ok;
  };

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Disable button during submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "SUBMITTING...";
    }

    // Prepare form data with Load Officer field names
    const formData = new FormData();
    formData.append("Full Name", name.value.trim());
    formData.append("Email", email.value.trim());
    formData.append("State", state.value);
    formData.append("Postal Code", zip.value.replace(/\D/g,"").slice(0,5));
    formData.append("Phone", phone.value);

    try {
      const response = await fetch(SUBMIT_URL, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        openModal(`Thank you! We'll contact you shortly about your savings.`);
        form.reset();
        state.value = "Florida";
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Lead submission error:", error);
      openModal(`Something went wrong. Please call us at (XXX) XXX-XXXX`);
    } finally {
      // Re-enable button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "SEE MY SAVINGS!";
      }
    }
  });
})();
