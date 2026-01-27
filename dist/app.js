// app.js
(() => {
  const STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
    "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
    "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
    "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
    "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"
  ];

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Form elements
  const form = document.getElementById("leadForm");
  const state = document.getElementById("state");
  const name = document.getElementById("name");
  const zip = document.getElementById("zip");
  const phone = document.getElementById("phone");

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

    if (!name?.value.trim()) { setErr(name, "Required"); ok = false; } else setErr(name, "");
    if (!state?.value) { setErr(state, "Required"); ok = false; } else setErr(state, "");

    const z = (zip?.value || "").replace(/\D/g, "");
    if (z.length !== 5) { setErr(zip, "Enter 5-digit zip"); ok = false; } else setErr(zip, "");

    const p = (phone?.value || "").replace(/\D/g, "");
    if (p.length !== 10) { setErr(phone, "Enter 10-digit phone"); ok = false; } else setErr(phone, "");

    return ok;
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.value.trim(),
      state: state.value,
      zip: zip.value.replace(/\D/g,"").slice(0,5),
      phone: phone.value
    };

    // TODO: send to your endpoint
    // fetch("/api/leads", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });

    openModal(`Lead captured for ${payload.name} (${payload.state} ${payload.zip}).`);
    form.reset();
    state.value = "Florida";
  });
})();
