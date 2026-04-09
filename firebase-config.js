import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  enableIndexedDbPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 1) Copy this file to firebase-config.js
// 2) Replace the placeholder values with your Firebase project credentials.
// 3) In Firebase console, create a Firestore database.
// 4) Set Firestore rules appropriately (for quick demo projects, open rules are common).

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  // Multi-tab open / unsupported browser issues are safe to ignore.
  console.warn("Offline persistence not enabled:", err.code);
});

export { db };
