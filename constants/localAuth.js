import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USERS: '@lappj_users',
  SESSION: '@lappj_session',
};

// Usuários pré-cadastrados. Adicione ou edite conforme necessário.
const DEFAULT_USERS = [
  { email: 'motorista@lappj.com', password: 'motorista123', name: 'João da Silva', perfil: 'motorista' },
  { email: 'coordenador@lappj.com', password: 'coord123', name: 'Maria Coordenadora', perfil: 'coordenador' },
];

// Inicializa o banco local se ainda não existir
const initUsers = async () => {
  const stored = await AsyncStorage.getItem(KEYS.USERS);
  if (!stored) {
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
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

// Encerra a sessão
export const signOut = async () => {
  await AsyncStorage.removeItem(KEYS.SESSION);
};

// Cadastra novo usuário (para uso futuro)
export const registerUser = async ({ email, password, name, perfil }) => {
  const users = await getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error('Este e-mail já está cadastrado.');
  users.push({ email, password, name, perfil });
  await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
};
