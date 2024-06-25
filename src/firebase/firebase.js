// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// just change config below to start
const firebaseConfig = {
  apiKey: "AIzaSyClBZu_pT9-mW-HUp69pHBjZjpv84zwjSw",
  authDomain: "travel-capstone.firebaseapp.com",
  projectId: "travel-capstone",
  storageBucket: "travel-capstone.appspot.com",
  messagingSenderId: "379827442174",
  appId: "1:379827442174:web:d3f50a87921cddcddc30af",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
