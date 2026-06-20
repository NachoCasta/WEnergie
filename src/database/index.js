// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKehkoV-A9S7Fsfii2fZpRid_CycMdo7k",
  authDomain: "w-energie.firebaseapp.com",
  projectId: "w-energie",
  storageBucket: "w-energie.appspot.com",
  messagingSenderId: "617147392036",
  appId: "1:617147392036:web:ff6e5352e0e4d2464578b1",
  measurementId: "G-G7HTL0DPMC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
