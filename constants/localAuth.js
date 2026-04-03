import AsyncStorage from '@react-native-async-storage/async-storage';
import { JOURNEY_KEYS } from './journeyKeys';

const KEYS = {
  USERS: '@lappj_users',
  SESSION: '@lappj_session',
};

// Usuários pré-cadastrados. Adicione ou edite conforme necessário.
const DEFAULT_USERS = [
  { email: 'motorista@lappj.com', password: 'motorista123', name: 'João da Silva', perfil: 'motorista' },
  { email: 'coordenador@lappj.com', password: 'coord123', name: 'Maria Coordenadora', perfil: 'coordenador' },
  { email: 'dev@lappj.com', password: 'devlappj2026', name: 'Desenvolvedor LappJ', perfil: 'dev' },
];

// Inicializa o banco e garante que contas padrão sempre existam
const initUsers = async () => {
  const stored = await AsyncStorage.getItem(KEYS.USERS);
  if (!stored) {
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    return;
  }
  // Garante que contas padrão existam mesmo em bancos já criados
  let users = JSON.parse(stored);
  let changed = false;
  for (const def of DEFAULT_USERS) {
    const exists = users.find((u) => u.email.toLowerCase() === def.email.toLowerCase());
    if (!exists) {
      users.push(def);
      changed = true;
    }
  }
  if (changed) {
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
};

const getUsers = async () => {
  await initUsers();
  const stored = await AsyncStorage.getItem(KEYS.USERS);
  return JSON.parse(stored);
};

// Retorna o usuário logado ou null
export const getSession = async () => {
  const stored = await AsyncStorage.getItem(KEYS.SESSION);
  return stored ? JSON.parse(stored) : null;
};

// Faz login verificando credenciais
export const signIn = async (email, password) => {
  const users = await getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error('E-mail ou senha incorretos.');
  const session = { email: user.email, name: user.name, perfil: user.perfil };
  await AsyncStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  return session;
};

// Encerra a sessão e limpa o estado de jornada do motorista
export const signOut = async () => {
  await AsyncStorage.multiRemove([
    KEYS.SESSION,
    ...Object.values(JOURNEY_KEYS),
  ]);
};

// Cadastra novo usuário (para uso futuro)
export const registerUser = async ({ email, password, name, perfil }) => {
  const users = await getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error('Este e-mail já está cadastrado.');
  users.push({ email, password, name, perfil });
  await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

// ─── Funções Admin (apenas perfil 'dev') ─────────────────────────────────────

export const adminGetAllUsers = async () => {
  return await getUsers();
};

export const adminDeleteUser = async (email) => {
  const users = await getUsers();
  const filtered = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
  await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(filtered));
};

export const adminChangeRole = async (email, newPerfil) => {
  const users = await getUsers();
  const updated = users.map((u) =>
    u.email.toLowerCase() === email.toLowerCase() ? { ...u, perfil: newPerfil } : u
  );
  await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(updated));
};

export const adminClearJourneyData = async (userEmail) => {
  // Remove todas as chaves de jornada prefixadas com o e-mail (futura impl. multi-usuário)
  // Por ora limpa as chaves globais únicas (app single-user por enquanto)
  await AsyncStorage.multiRemove(Object.values(JOURNEY_KEYS));
};

// Redefine o banco de usuários para os padrões (útil em dev)
export const adminResetDatabase = async () => {
  await AsyncStorage.removeItem(KEYS.USERS);
  await initUsers();
};

export const adminGetUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
};
