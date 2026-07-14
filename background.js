/* ============================================================
   Ambient background — "Frosted" system v5
   Injects a field of soft, blurred chrome blobs that drift
   slowly behind the frosted-glass panels and refract through
   them. Pure CSS handles the look + motion (see styles.css);
   this only puts the markup on the page, once per load.
   ============================================================ */
function initBackground() {
  if (document.querySelector(".chrome-field")) return;

  const field = document.createElement("div");
  field.className = "chrome-field";
  field.setAttribute("aria-hidden", "true");
  field.innerHTML =
    '<span class="orb o1"></span>' +
    '<span class="orb o2"></span>' +
    '<span class="orb o3"></span>' +
    '<span class="orb o4"></span>' +
    '<span class="orb o5"></span>' +
    '<span class="orb o6"></span>';

  document.body.prepend(field);
}

document.addEventListener("DOMContentLoaded", () => {
  initBackground();
  if (typeof lucide !== "undefined") lucide.createIcons();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
