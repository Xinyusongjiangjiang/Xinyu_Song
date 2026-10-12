const documents = {
  presentation: {
    kind: "Research Presentation",
    title: "Education Finance Research Presentation",
    pages: 23,
    folder: "presentation",
    paddedNames: true,
  },
  calculus: {
    kind: "Supporting Report",
    title: "Calculus Supporting Report",
    pages: 10,
    folder: "calculus",
    paddedNames: true,
  },
  proposal: {
    kind: "Policy Proposal",
    title: "AI Mini-Programs in Public Schools",
    pages: 6,
    folder: "proposal",
    paddedNames: false,
  },
  essay: {
    kind: "Essay",
    title: "The Impact of Fiscal Equalization on Educational Inequality Caused by Regional Fiscal Disparities in China",
    pages: 6,
    folder: "essay",
    paddedNames: false,
  },
};

const documentId = new URLSearchParams(window.location.search).get("document");
const documentData = documents[documentId] || documents.presentation;
const title = document.getElementById("document-title");
const kind = document.getElementById("document-kind");
const meta = document.getElementById("document-meta");
const pages = document.getElementById("document-pages");

document.title = `${documentData.title} | Xinyu Song`;
title.textContent = documentData.title;
kind.textContent = documentData.kind;
meta.textContent = `${documentData.pages} pages`;

for (let page = 1; page <= documentData.pages; page += 1) {
  const number = documentData.paddedNames ? String(page).padStart(2, "0") : String(page);
  const figure = document.createElement("figure");
  const image = document.createElement("img");

  image.src = `assets/document-previews/${documentData.folder}/page-${number}.jpg`;
  image.alt = `${documentData.title}, page ${page}`;
  image.loading = page <= 2 ? "eager" : "lazy";
  image.decoding = "async";

  figure.append(image);
  pages.append(figure);
}
