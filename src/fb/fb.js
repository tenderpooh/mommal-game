import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiTiYuvV_NW41e_Lx2irypYMTEaW33REg",
  authDomain: "mammal-game.firebaseapp.com",
  projectId: "mammal-game",
  storageBucket: "mammal-game.appspot.com",
  messagingSenderId: "791245014144",
  appId: "1:791245014144:web:d73eda8ad2abad2d079265",
  measurementId: "G-HBHD1BWW4R",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const firestore = firebase.firestore;
