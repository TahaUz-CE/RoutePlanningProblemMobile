// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5gEw6R0C2Zuw1B-R09HTUCqNyW1St-fE",
  authDomain: "fir-auth-3acd0.firebaseapp.com",
  projectId: "fir-auth-3acd0",
  storageBucket: "fir-auth-3acd0.appspot.com",
  messagingSenderId: "630820592077",
  appId: "1:630820592077:web:fa6509999a789ed3ff8c84"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}else{
    app = firebase.app()
}

const auth = firebase.auth()

export {auth};