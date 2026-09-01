const STORAGE_KEY = "xinyu-site-draft-v2";
const PHOTO_KEY = "xinyu-site-photos-v1";
const MEDIA_TYPE_KEY = "xinyu-site-media-types-v1";

const editToggle = document.querySelector("#edit-toggle");
const resetButton = document.querySelector("#reset-content");
const editableItems = [...document.querySelectorAll(".editable")];
const photoItems = [...document.querySelectorAll(".editable-photo")];
const navDropdowns = [...document.querySelectorAll(".nav-dropdown")];

let editing = false;

function loadJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function saveText(id, value) {
  const data = loadJSON(STORAGE_KEY);
  data[id] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function savePhoto(id, value) {
  const data = loadJSON(PHOTO_KEY);
  data[id] = value;
  localStorage.setItem(PHOTO_KEY, JSON.stringify(data));
}

function saveMediaType(id, value) {
  const data = loadJSON(MEDIA_TYPE_KEY);
  data[id] = value;
  localStorage.setItem(MEDIA_TYPE_KEY, JSON.stringify(data));
}

function clearVideo(el) {
  el.querySelectorAll("video").forEach((video) => video.remove());
}

function applyPhoto(el, dataUrl) {
  clearVideo(el);
  el.style.backgroundImage = `linear-gradient(145deg, rgba(255,255,255,.18), rgba(77,157,204,.08)), url("${dataUrl}")`;
  el.style.backgroundSize = "cover";
  el.style.backgroundPosition = el.classList.contains("hero-photo") ? "center right" : "center";
  el.classList.add("has-photo");
  el.classList.remove("has-video");
}

function applyVideo(el, dataUrl) {
  clearVideo(el);
  el.style.backgroundImage = "";
  const video = document.createElement("video");
  video.src = dataUrl;
  video.controls = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";
  el.prepend(video);
  el.classList.add("has-video");
  el.classList.remove("has-photo");
}

function applyMedia(el, dataUrl, type = "image") {
  if (type.startsWith("video")) {
    applyVideo(el, dataUrl);
  } else {
    applyPhoto(el, dataUrl);
  }
}

function setEditing(next) {
  editing = next;
  document.body.classList.toggle("is-editing", editing);
  editToggle.textContent = editing ? "Done" : "Edit";

  editableItems.forEach((el) => {
    el.contentEditable = editing ? "true" : "false";
  });
}

function initTextEditing() {
  const saved = loadJSON(STORAGE_KEY);

  editableItems.forEach((el) => {
    const id = el.dataset.editId;
    if (saved[id]) {
      el.innerHTML = saved[id];
    }

    el.addEventListener("input", () => {
      saveText(id, el.innerHTML);
    });
  });
}

function initPhotoEditing() {
  const saved = loadJSON(PHOTO_KEY);
  const savedTypes = loadJSON(MEDIA_TYPE_KEY);

  photoItems.forEach((el) => {
    const id = el.dataset.photoId;
    const input = el.querySelector('input[type="file"]');

    if (saved[id]) {
      applyMedia(el, saved[id], savedTypes[id]);
    }

    el.addEventListener("click", (event) => {
      if (!editing) return;
      if (event.target === input) return;
      input.click();
    });

    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const result = reader.result;
        if (typeof result === "string") {
          applyMedia(el, result, file.type);
          savePhoto(id, result);
          saveMediaType(id, file.type);
        }
      });
      reader.readAsDataURL(file);
    });
  });
}

editToggle.addEventListener("click", () => setEditing(!editing));

resetButton.addEventListener("click", () => {
  const confirmed = confirm("Clear saved edits and uploaded preview photos?");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PHOTO_KEY);
  localStorage.removeItem(MEDIA_TYPE_KEY);
  window.location.reload();
});

navDropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector(".nav-trigger");
  if (!trigger) return;

  dropdown.addEventListener("mouseenter", () => {
    trigger.setAttribute("aria-expanded", "true");
  });

  dropdown.addEventListener("mouseleave", () => {
    trigger.setAttribute("aria-expanded", "false");
  });
});

initTextEditing();
initPhotoEditing();
setEditing(false);
