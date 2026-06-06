// ============================================================
//  firebaseAuth.js — Autenticação com Firebase
//  Substitui o localAuth.js local (AsyncStorage) pelo Firebase Auth + Firestore
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { JOURNEY_KEYS } from './journeyKeys';

// ─── Configuração do Google Sign-In ───────────────────────────────────────────
// ATENÇÃO: Substitua pelo seu webClientId do Google Cloud Console
// Firebase Console → Authentication → Sign-in method → Google → Web SDK configuration
const GOOGLE_WEB_CLIENT_ID = '409649830474-v596i2u3vnu39ml5bn7g0jkbtcn8lovu.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Busca o perfil do usuário no Firestore (coleção "users").
 * Retorna { email, name, perfil, uid } ou null.
 */
const getUserProfile = async (uid) => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { uid, ...snap.data() };
};

/**
 * Cria o documento do usuário no Firestore se ainda não existir.
 */
const ensureUserProfile = async (uid, { email, name, perfil = 'motorista' }) => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email,
      name: name || email.split('@')[0],
      perfil,
      createdAt: serverTimestamp(),
    });
  }
  return getUserProfile(uid);
};

/**
 * Atualiza o perfil (motorista/coordenador) de um usuário no Firestore.
 * Usado pela tela de escolha de perfil após login com Google.
 */
export const updateUserPerfil = async (uid, perfil) => {
  const { updateDoc } = await import('firebase/firestore');
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { perfil });
};

// ─── Sessão ───────────────────────────────────────────────────────────────────

/**
 * Retorna o usuário atual do Firebase Auth (ou null).
 * Também tenta ler o perfil salvo no AsyncStorage como cache.
 */
export const getSession = async () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (!firebaseUser) {
        resolve(null);
        return;
      }
      try {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          resolve(profile);
        } else {
          resolve(null);
        }
      } catch {
        resolve(null);
      }
    });
  });
};

// ─── Login com Email/Senha ─────────────────────────────────────────────────────

export const signIn = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = await getUserProfile(credential.user.uid);
    if (!profile) throw new Error('Perfil do usuário não encontrado. Entre em contato com o suporte.');
    return profile;
  } catch (error) {
    // Traduz erros do Firebase para o usuário
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('E-mail ou senha incorretos.');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Muitas tentativas. Tente novamente em alguns minutos.');
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Sem conexão com a internet. Verifique sua rede.');
    }
    throw new Error(error.message || 'Erro ao fazer login.');
  }
};

// ─── Login com Google ──────────────────────────────────────────────────────────

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();

    const idToken = signInResult.data?.idToken ?? signInResult.idToken;
    if (!idToken) throw new Error('Não foi possível obter o token do Google.');

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const credential = await signInWithCredential(auth, googleCredential);

    // Verifica se o usuário já tinha perfil no Firestore ANTES de criar
    const existingProfile = await getUserProfile(credential.user.uid);
    const isNewUser = !existingProfile;

    // Cria perfil no Firestore se não existir (perfil temporário, será atualizado)
    const profile = await ensureUserProfile(credential.user.uid, {
      email: credential.user.email,
      name: credential.user.displayName || credential.user.email.split('@')[0],
      perfil: 'motorista', // temporário para novos usuários
    });

    return { ...profile, isNewUser };
  } catch (error) {
    if (error.code === 'SIGN_IN_CANCELLED') {
      throw new Error('Login cancelado.');
    }
    if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      throw new Error('Google Play Services não disponível neste dispositivo.');
    }
    throw new Error(error.message || 'Erro ao fazer login com Google.');
  }
};

// ─── Cadastro com Email/Senha ──────────────────────────────────────────────────

export const registerUser = async ({ email, password, name, perfil = 'motorista' }) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const profile = await ensureUserProfile(credential.user.uid, {
      email: email.trim(),
      name: name.trim(),
      perfil,
    });
    return profile;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este e-mail já está cadastrado.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('E-mail inválido.');
    }
    throw new Error(error.message || 'Erro ao criar conta.');
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const signOut = async () => {
  try {
    // Faz logout do Google também (se estava logado)
    const isGoogleSignedIn = await GoogleSignin.isSignedIn();
    if (isGoogleSignedIn) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
  } catch {
    // Ignora erros do Google Sign-out
  }

  // Limpa dados de jornada do AsyncStorage
  try {
    await AsyncStorage.multiRemove(Object.values(JOURNEY_KEYS));
  } catch {
    // Ignora erros de limpeza
  }

  // Faz logout do Firebase Auth
  await firebaseSignOut(auth);
};

// ─── Funções Admin ────────────────────────────────────────────────────────────

import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

export const adminGetAllUsers = async () => {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
};

export const adminDeleteUser = async (email) => {
  // Busca o usuário pelo email e deleta o documento do Firestore
  // Nota: deletar do Firebase Auth requer o Admin SDK (server-side)
  // Por ora deletamos apenas do Firestore (o usuário não consegue mais acessar perfil)
  const snap = await getDocs(collection(db, 'users'));
  const userDoc = snap.docs.find((d) => d.data().email?.toLowerCase() === email.toLowerCase());
  if (userDoc) {
    await deleteDoc(doc(db, 'users', userDoc.id));
  }
};

export const adminChangeRole = async (email, newPerfil) => {
  const snap = await getDocs(collection(db, 'users'));
  const userDoc = snap.docs.find((d) => d.data().email?.toLowerCase() === email.toLowerCase());
  if (userDoc) {
    await updateDoc(doc(db, 'users', userDoc.id), { perfil: newPerfil });
  }
};

export const adminClearJourneyData = async (userEmail) => {
  // Limpa os dados de jornada do AsyncStorage local
  await AsyncStorage.multiRemove(Object.values(JOURNEY_KEYS));
};

export const adminResetDatabase = async () => {
  // Remove todos os usuários do Firestore e recria os padrões
  const snap = await getDocs(collection(db, 'users'));
  const deletePromises = snap.docs.map((d) => deleteDoc(doc(db, 'users', d.id)));
  await Promise.all(deletePromises);
  // Nota: não recria usuários padrão pois eles precisam existir no Firebase Auth
  // O admin deverá recadastrá-los manualmente ou via função do servidor
  Alert.alert(
    'Banco resetado',
    'Todos os perfis foram removidos do Firestore. Os usuários ainda existem no Firebase Auth — recadastre os usuários padrão pelo app.'
  );
};

export const adminGetUserByEmail = async (email) => {
  const snap = await getDocs(collection(db, 'users'));
  const userDoc = snap.docs.find((d) => d.data().email?.toLowerCase() === email.toLowerCase());
  return userDoc ? { uid: userDoc.id, ...userDoc.data() } : null;
};
