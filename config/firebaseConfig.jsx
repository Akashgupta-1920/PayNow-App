import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDwbz1m1Kr-AxgRoMSfOUOuRpV87aj8Sdw",
  authDomain: "payment-app-6dde7.firebaseapp.com",
  projectId: "payment-app-6dde7",
  storageBucket: "payment-app-6dde7.appspot.com",
  messagingSenderId: "446922617587",
  appId: "1:446922617587:web:519006c876a66624e07d86",
  measurementId: "G-4L1G70Z7L6",
};

// Prevent reinitialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Always initialize auth with AsyncStorage for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
const db = getFirestore(app);

export { auth, db };
