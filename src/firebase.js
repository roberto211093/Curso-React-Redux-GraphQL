import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

let firebaseConfig = {
    apiKey: "AIzaSyBh0y0-PPWQmNKmqypoyAoHv5OoqLUf_O0",
    authDomain: "go0gle-auth.firebaseapp.com",
    databaseURL: "https://go0gle-auth.firebaseio.com",
    projectId: "go0gle-auth",
    storageBucket: "go0gle-auth.appspot.com",
    messagingSenderId: "369596630516",
    appId: "1:369596630516:web:cc4084f21fc466c2f525a1",
    measurementId: "G-RLJZ41PYWM"
}

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore().collection('favs');

export function getFavoritos(uid) {
    return db.doc(uid).get()
        .then(res => {
            return res.data().favoritos
        });
}

export function updateDB(array, uid) {
    return db.doc(uid).set({favoritos: [...array]}); // Siempre hay que enviar un objeto
}

export function signOutGoogle() {
    firebase.auth().signOut();
}

export function loginWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
    .then(snap => snap.user);
}
