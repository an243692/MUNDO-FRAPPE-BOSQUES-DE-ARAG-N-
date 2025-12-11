// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtJDVXDQlywzU4h0ARunvauLYMCK9d2Uo",
  authDomain: "mundo-frappe-bosques.firebaseapp.com",
  databaseURL: "https://mundo-frappe-bosques-default-rtdb.firebaseio.com",
  projectId: "mundo-frappe-bosques",
  storageBucket: "mundo-frappe-bosques.firebasestorage.app",
  messagingSenderId: "318086759976",
  appId: "1:318086759976:web:4207653b6af8deb262571d",
  measurementId: "G-2M6CJXZM00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, analytics, database, storage };









