// main.js (clean)

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- NAV ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const closeNav = () => {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
    }
    document.body.style.removeProperty("overflow");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      const clickInside = nav.contains(e.target) || toggle.contains(e.target);
      if (!clickInside) closeNav();
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 900px)").matches) closeNav();
    });
  }

  // Aktiven Menüpunkt markieren
  const path = location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll("header nav a").forEach(a => {
    if (a.getAttribute("href").replace(/\/$/, "") === path) a.setAttribute("aria-current", "page");
  });

  /* ---------- REVEAL (Scroll-In) ---------- */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const items = document.querySelectorAll('[data-reveal], .reveal');
    if (items.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const delay = el.getAttribute('data-delay');
          if (delay) el.style.setProperty('--delay', delay);
          el.classList.add('is-visible');
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
      items.forEach(el => io.observe(el));
    }
  }

  /* ---------- FORM ---------- */
  const form = document.getElementById("contactForm");
  const alertBox = document.getElementById("formAlert");
  const sendBtn = form?.querySelector('button[type="submit"]');
  const emailEl = form?.querySelector("#email");
  const phoneEl = form?.querySelector("#phone");

  if (form && alertBox) {
    // E-Mail: freundliche Fehltexte
    if (emailEl) {
      emailEl.addEventListener("input", () => emailEl.setCustomValidity(""));
      emailEl.addEventListener("invalid", () => {
        if (emailEl.validity.valueMissing) {
          emailEl.setCustomValidity("Bitte deine E-Mail-Adresse eingeben.");
        } else if (emailEl.validity.typeMismatch) {
          emailEl.setCustomValidity("Das sieht nicht wie eine gültige E-Mail aus.");
        }
      });
    }

    // Telefon: kleine Aufräumung (keine harte Validierung hier)
    if (phoneEl) {
      phoneEl.addEventListener("input", () => {
        phoneEl.value = phoneEl.value.replace(/\s{2,}/g, " ").trimStart();
        phoneEl.setCustomValidity("");
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // native Validierung zuerst
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Honeypot
      const hp = form.querySelector('[name="company"]');
      if (hp && hp.value) return; // Bot

      // Alert-Box resetten & sichtbar machen (kein inline hide mehr)
      alertBox.className = "form-alert";
      alertBox.textContent = "";
      alertBox.style.removeProperty("display");

      if (sendBtn) sendBtn.disabled = true;

      // Payload sammeln
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      payload.consent = !!fd.get("consent");

      try {
        const res = await fetch("/.netlify/functions/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: "Senden fehlgeschlagen." }));
          throw new Error(error);
        }

        // Erfolg
        alertBox.textContent = "Danke! Ihre Nachricht wurde erfolgreich gesendet.";
        alertBox.classList.add("success");
        form.reset();

        // Auto-Hide per Klasse (kein inline display:none, damit nächste Anzeige klappt)
        setTimeout(() => {
          alertBox.className = "form-alert";
        }, 6000);

      } catch (err) {
        // Fehler
        alertBox.textContent = err.message || "Leider konnte die Nachricht nicht gesendet werden.";
        alertBox.classList.add("error");
        console.error(err);
      } finally {
        if (sendBtn) sendBtn.disabled = false;
      }
    });
  }
});
