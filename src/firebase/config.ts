// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbEAnuAXUaHHzR0-2TsKImkERLL9TnNaY",
  authDomain: "miprimerproyectoenfireba-4aeec.firebaseapp.com",
  projectId: "miprimerproyectoenfireba-4aeec",
  storageBucket: "miprimerproyectoenfireba-4aeec.firebasestorage.app",
  messagingSenderId: "933144439119",
  appId: "1:933144439119:web:2ec473e9b600680c883d3a",
  measurementId: "G-YC0DCPLWEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();


export { app, auth}