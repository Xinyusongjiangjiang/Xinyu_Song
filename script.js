document.querySelectorAll(".editable-photo[data-static-src]").forEach((element) => {
  const src = element.dataset.staticSrc;

  if (!src || element.querySelector("img.uploaded-photo")) {
    return;
  }

  const image = document.createElement("img");
  image.className = "uploaded-photo";
  image.src = src;
  image.alt = element.dataset.staticAlt || "Portfolio photograph";
  element.prepend(image);
  element.classList.add("has-photo");
});

document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
  const trigger = dropdown.querySelector(".nav-trigger");

  if (!trigger) {
    return;
  }

  dropdown.addEventListener("mouseenter", () => trigger.setAttribute("aria-expanded", "true"));
  dropdown.addEventListener("mouseleave", () => trigger.setAttribute("aria-expanded", "false"));
});
