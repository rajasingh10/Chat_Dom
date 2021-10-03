import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCDvpALb9u1Qn3IXWSNSjP0NtejbWNzsUY",
  authDomain: "chatdom-54ec5.firebaseapp.com",
  projectId: "chatdom-54ec5",
  storageBucket: "chatdom-54ec5.appspot.com",
  messagingSenderId: "1050566466990",
  appId: "1:1050566466990:web:d25b78788d10b75656fc3f",
  measurementId: "G-VHJTWNKJ5Z"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth,provider, storage}
export default db;