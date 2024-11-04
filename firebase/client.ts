import { initializeApp } from "firebase/app";
import { getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPOoQKihvmB3o7Z6ATnDOZ24uDk5Pk9Xo",
  authDomain: "chess-f17dd.firebaseapp.com",
  projectId: "chess-f17dd",
  storageBucket: "chess-f17dd.appspot.com",
  messagingSenderId: "123834089832",
  appId: "1:123834089832:web:f8938281639508a80716dd",
  measurementId: "G-DH08Q60NJY",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const storage = getStorage();
const clientStorageRef = (value: string) => ref(storage, value);

export { auth, clientStorageRef };
