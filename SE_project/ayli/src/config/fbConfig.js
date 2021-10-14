import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
  
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyD-Ely7q59oIt8gAAXAGxwl1te-iNNIcBI",
    authDomain: "ayli-fc138.firebaseapp.com",
    projectId: "ayli-fc138",
    storageBucket: "ayli-fc138.appspot.com",
    messagingSenderId: "78314201588",
    appId: "1:78314201588:web:712c10ca8c51cc0e4259a1",
    measurementId: "G-MFBSXHTJ9V"
};  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {
    storage, firebase as default
};