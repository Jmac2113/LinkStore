# LinkStore (GitHub Pages + Firebase)

A minimal website you can host on GitHub Pages that lets users:

- Add a **title** and **URL**.
- Persist links in **Firebase Firestore**.
- See links update in real time.
- Delete saved links.

## Files

- `index.html` – app structure.
- `styles.css` – styling.
- `app.js` – link CRUD behavior.
- `firebase-config.js` – Firebase initialization (replace placeholders).
- `firebase-config.example.js` – template config file.

## Setup Firebase

1. Create a Firebase project.
2. Add a web app in Firebase project settings.
3. Copy the config values into `firebase-config.js`.
4. Create a Firestore database (start in test mode for quick setup, then lock rules before production).

Example Firestore rules for demo use:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /links/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In GitHub repo settings, open **Pages**.
3. Under **Build and deployment**, choose:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch), `/ (root)`
4. Save.

Your site will be served on your GitHub Pages URL.

## Notes

- Firebase config values are safe to expose in client apps, but secure your Firestore rules.
- For production, use Firebase Authentication and rule-based access control.
