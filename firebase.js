// firebase.js — modular wrapper for Firebase v9.6.5 (browser)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  onValue,
  update,
  query,
  orderByChild,
  equalTo,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBzAN3ybPGr_GQEkCCEn2Sh-jB8mejfZI",
  authDomain: "docazza-3ab1a.firebaseapp.com",
  databaseURL:
    "https://docazza-3ab1a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "docazza-3ab1a",
  storageBucket: "docazza-3ab1a.firebasestorage.app",
  messagingSenderId: "863115710805",
  appId: "1:863115710805:web:5090c3d713566070891fdc",
  measurementId: "G-2SGBD9YQHZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export {
  app,
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  ref,
  get,
  set,
  push,
  onValue,
  update,
  query,
  orderByChild,
  equalTo,
  serverTimestamp,
};
