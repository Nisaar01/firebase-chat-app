import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCrO7Jnq55AYQS7Sga34Yhu0wu-3qRuyHA",
  authDomain: "final-chat-app-2024.firebaseapp.com",
  projectId: "final-chat-app-2024",
  storageBucket: "final-chat-app-2024.appspot.com",
  messagingSenderId: "627435982227",
  appId: "1:627435982227:web:4817b423a8ec1a23bd6c66",
  measurementId: "G-99N55YWQPD",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)
