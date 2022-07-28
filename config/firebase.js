// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-437-UPv-dRDIFfrD2ClmuUcYE_ajV6o",
  authDomain: "twiclone-339909.firebaseapp.com",
  projectId: "twiclone-339909",
  storageBucket: "twiclone-339909.appspot.com",
  messagingSenderId: "379684397437",
  appId: "1:379684397437:web:0cc8bbf01e731089a76c14",
  measurementId: "G-CRJX76EW4N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
