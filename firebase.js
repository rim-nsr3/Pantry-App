// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwdcDgzDO9dP1BsNAPZVu5WM9DKMc_2RQ",
  authDomain: "pantryapp-b5e73.firebaseapp.com",
  projectId: "pantryapp-b5e73",
  storageBucket: "pantryapp-b5e73.appspot.com",
  messagingSenderId: "600244327958",
  appId: "1:600244327958:web:3c29fc5eed0b6a71e68737"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {app, firestore}