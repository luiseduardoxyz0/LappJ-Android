// ============================================================
//  localAuth.js — REDIRECIONAMENTO PARA FIREBASE
//
//  Este arquivo agora é apenas um proxy que re-exporta tudo do
//  firebaseAuth.js. Todos os arquivos que importam de localAuth
//  continuam funcionando sem nenhuma mudança.
// ============================================================

export {
  getSession,
  signIn,
  signInWithGoogle,
  registerUser,
  signOut,
  adminGetAllUsers,
  adminDeleteUser,
  adminChangeRole,
  adminClearJourneyData,
  adminResetDatabase,
  adminGetUserByEmail,
  updateUserData,
  changeUserPassword,
} from './firebaseAuth';
