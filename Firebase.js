// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNCZ87Us74StppUmsV2TD9Fx1hP50P3Sw",
  authDomain: "lb-m151-project.firebaseapp.com",
  projectId: "lb-m151-project",
  storageBucket: "lb-m151-project.appspot.com",
  messagingSenderId: "992993877720",
  appId: "1:992993877720:web:04726c6cc9b57b3aa981ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// Export firestore database
// It will be imported into your react app whenever it is needed
export {db};
export const auth = getAuth(app);

