// ============================================================
//  firebaseConfig.EXAMPLE.js — Modelo de configuração Firebase
//  Copie este arquivo para firebaseConfig.js e preencha com
//  suas credenciais do Firebase Console.
//
//  🔗 Como obter as credenciais:
//  Firebase Console → Projeto → ⚙️ Configurações → Seus apps → SDK Web
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID",  // opcional
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/** @type {import('firebase/auth').Auth} */
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export default app;
