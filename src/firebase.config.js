// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDBVfZXF7NzUCfp5yYl4McKH_HYayH0m-k",
    authDomain: "ghardekho-fec2f.firebaseapp.com",
    projectId: "ghardekho-fec2f",
    storageBucket: "ghardekho-fec2f.appspot.com",
    messagingSenderId: "589510198469",
    appId: "1:589510198469:web:160ea995eb6ce8a8099cac",
    measurementId: "G-R9L2106BV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();