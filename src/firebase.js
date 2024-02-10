import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA5pEJ2Dq_QdLcPvDE9Eq3-FaTvt5OHlvI",
    authDomain: "disney-clone-8aa2c.firebaseapp.com",
    projectId: "disney-clone-8aa2c",
    storageBucket: "disney-clone-8aa2c.appspot.com",
    messagingSenderId: "74779669804",
    appId: "1:74779669804:web:3b31257e4fa3db29f5a889",
    measurementId: "G-EQ7K37XS4J",
    databaseURL: "https://disney-clone-8aa2c-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();