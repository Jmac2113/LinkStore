import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase-config.js";

const form = document.getElementById("link-form");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const statusText = document.getElementById("status");
const linksList = document.getElementById("links-list");
const clearFormButton = document.getElementById("clear-form");

const linksCollection = collection(db, "links");
const linksQuery = query(linksCollection, orderBy("createdAt", "desc"));

const showStatus = (message, isError = false) => {
  statusText.textContent = message;
  statusText.style.color = isError ? "#dc2626" : "#6b7280";
};

const normalizeUrl = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const createLinkItem = ({ id, title, url }) => {
  const listItem = document.createElement("li");
  listItem.className = "link-item";

  const content = document.createElement("div");

  const titleLink = document.createElement("a");
  titleLink.href = url;
  titleLink.target = "_blank";
  titleLink.rel = "noopener noreferrer";
  titleLink.textContent = title;

  const urlText = document.createElement("p");
  urlText.className = "link-url";
  urlText.textContent = url;

  content.append(titleLink, urlText);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    try {
      await deleteDoc(doc(db, "links", id));
      showStatus("Link deleted.");
    } catch (error) {
      showStatus(`Could not delete link: ${error.message}`, true);
    }
  });

  listItem.append(content, deleteButton);
  return listItem;
};

const renderLinks = (snapshot) => {
  linksList.innerHTML = "";

  if (snapshot.empty) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty";
    emptyState.textContent = "No links yet. Add your first one above.";
    linksList.appendChild(emptyState);
    return;
  }

  snapshot.forEach((record) => {
    const data = record.data();
    const item = createLinkItem({
      id: record.id,
      title: data.title,
      url: data.url,
    });
    linksList.appendChild(item);
  });
};

onSnapshot(
  linksQuery,
  (snapshot) => {
    renderLinks(snapshot);
  },
  (error) => {
    showStatus(`Realtime sync failed: ${error.message}`, true);
  }
);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const url = normalizeUrl(urlInput.value);

  if (!title || !url) {
    showStatus("Please provide both a title and a valid URL.", true);
    return;
  }

  try {
    new URL(url);
  } catch {
    showStatus("URL format is invalid.", true);
    return;
  }

  try {
    await addDoc(linksCollection, {
      title,
      url,
      createdAt: serverTimestamp(),
    });

    form.reset();
    titleInput.focus();
    showStatus("Link saved.");
  } catch (error) {
    showStatus(`Failed to save link: ${error.message}`, true);
  }
});

clearFormButton.addEventListener("click", () => {
  form.reset();
  titleInput.focus();
  showStatus("");
});
