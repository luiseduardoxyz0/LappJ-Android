// ============================================================
//  firebaseConfig.js — Credenciais do projeto LappJ no Firebase
//  Auth com persistência via AsyncStorage (sessão sobrevive entre reaberturas)
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmQOFn3VzidL8xBwe6sXH-9sOgjkv65jw",
  authDomain: "lappj-9c1d4.firebaseapp.com",
  projectId: "lappj-9c1d4",
  storageBucket: "lappj-9c1d4.firebasestorage.app",
  messagingSenderId: "409649830474",
  appId: "1:409649830474:web:f4871732577c2cdd0324b3",
  measurementId: "G-HELFXW7W3R",
};

// Inicializa o app Firebase (safe para hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth com persistência no AsyncStorage — sessão sobrevive ao fechar o app
// O try/catch é necessário: initializeAuth lança erro se chamado mais de uma vez
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // Já inicializado (hot reload do Metro) — pega a instância existente
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export default app;
