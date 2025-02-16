// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK1WbU_uMb7aoL7lxgJIrpzlC5pUm3WDE",
  authDomain: "quizly-93768.firebaseapp.com",
  databaseURL: "https://quizly-93768-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quizly-93768",
  storageBucket: "quizly-93768.firebasestorage.app",
  messagingSenderId: "1038062301937",
  appId: "1:1038062301937:web:eb71edc2a388927e046f50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

export {database, ref, push}