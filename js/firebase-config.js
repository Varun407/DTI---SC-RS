const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "unihub-ab26b.firebaseapp.com",
  databaseURL: "https://unihub-ab26b-default-rtdb.firebaseio.com",
  projectId: "unihub-ab26b",
  storageBucket: "unihub-ab26b.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:YOUR_MESSAGING_SENDER_ID:web:e6f50686c57b44411fa60f",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase using the modular SDK (v10) via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other modules
export { auth, db };
