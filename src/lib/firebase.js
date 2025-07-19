// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { isSupported, getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARjm7SEIhd3aJUK7uqunX6pwUw25IO2PQ",
  authDomain: "fisha-3bd1e.firebaseapp.com",
  projectId: "fisha-3bd1e",
  storageBucket: "fisha-3bd1e.firebasestorage.app",
  messagingSenderId: "892167111455",
  appId: "1:892167111455:web:99569e259a1791a144262a",
  measurementId: "G-656XY74CM8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
const db = getFirestore(app);

export { app, analytics, db }; 