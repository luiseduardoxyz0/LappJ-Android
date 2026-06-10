# 🚚 LappJ — Gestão de Jornada e Entregas

> Projeto desenvolvido para a disciplina de **Linguagens e Técnicas de Programação IV**

**Status:** Em Desenvolvimento &nbsp;|&nbsp; **Versão:** 1.0.0-BETA &nbsp;|&nbsp; **Sprint 7 Concluída** &nbsp;|&nbsp; **Plataforma:** Android

---

## 📱 Sobre o Projeto

O **LappJ** é um aplicativo mobile de gestão de jornada e entregas voltado para motoristas e coordenadores de frota. O app permite o controle em tempo real da jornada de trabalho, acompanhamento de entregas do dia com dados persistidos no **Firebase Firestore**, navegação com rota real via **OSRM** e notificações locais de jornada.

**Última atualização:** Sprint 7 — Notificações Locais e Rota no Mapa (08/06/2026)

---

## 👥 Perfis de Usuário

### 🚛 Motorista
- Autentica via e-mail/senha ou **Google OAuth**
- Registra eventos da jornada (início, almoço, espera e fim) com timestamps
- Visualiza a lista de entregas do dia com filtros, busca e confirmação
- Navega pelo mapa com **rota real traçada via OSRM** até o ponto de entrega
- Recebe **notificações locais** de almoço e fim de jornada

### 🗂️ Coordenador
- Monitora cargas ativas e motoristas em rota
- Visualiza métricas de frota e atrasos críticos
- Acessa detalhe de cada motorista com opção de ligar ou localizar

### ⚙️ Dev / Admin
- Acessa painel administrativo completo
- Gerencia contas: alterar perfil, excluir, limpar jornada e resetar banco

---

## ✅ Requisitos Funcionais

O sistema conta com **44 requisitos funcionais** implementados. Abaixo o resumo por módulo:

| Módulo | RFs | Status |
|--------|-----|--------|
| Autenticação (Firebase + Google OAuth) | RF01–RF08 | ✅ 100% |
| Controle de Jornada | RF09–RF15 | ✅ 98–100% |
| Dashboard do Motorista | RF16–RF17 | ✅ 98% |
| Listagem e Confirmação de Entregas (Firestore) | RF18–RF23 | ✅ 100% |
| Mapa GPS + Rota OSRM | RF24–RF27 | ✅ 100% |
| Painel do Coordenador | RF28–RF34 | ⚙️ 85–100% |
| Navegação por Perfil e Tela de Perfil | RF35–RF38 | ✅ 100% |
| Splash Screen Animada e Painel Admin | RF39–RF44 | ✅ 100% |

---

## ⚙️ Requisitos Não Funcionais

| ID | Descrição | Status |
|----|-----------|--------|
| RNF01 | Android (testado em Pixel 8, API 36). iOS suportado, não testado. | ✅ |
| RNF02 | Modo Claro, Escuro e Sistema com persistência em AsyncStorage | ✅ 100% |
| RNF03 | Permissões de GPS, câmera, galeria e notificações locais em runtime | ✅ 75% |
| RNF04 | Performance: lazy loading e cache (pendente para fase de backend) | ⏳ 0% |
| RNF05 | Segurança: Firebase Auth gerencia senhas internamente | ⚠️ 40% |
| RNF06 | Conectividade: Firestore integrado; suporte offline pendente | ⚙️ 60% |

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|-----------|
| Framework | [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) 54.0.33 |
| Linguagem | TypeScript / JavaScript |
| Roteamento | [Expo Router](https://expo.github.io/router/) 6.0.23 (file-based) |
| Autenticação | [Firebase Authentication](https://firebase.google.com/) (e-mail + Google OAuth) |
| Login Social | [@react-native-google-signin](https://github.com/react-native-google-signin/google-signin) |
| Banco de Dados | [Firebase Firestore](https://firebase.google.com/docs/firestore) (collections: users, entregas) |
| Mapas | [Leaflet.js](https://leafletjs.com/) + OpenStreetMap via WebView |
| Rota no Mapa | [OSRM](http://project-osrm.org/) — API pública gratuita |
| GPS | [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) |
| Notificações | [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) (locais) |
| Estado Global | Context API (ThemeContext + EntregasContext) |
| Persistência Local | AsyncStorage (jornada, avatar, tema) |
| Ícones | Ionicons (@expo/vector-icons) |
| Mídia | [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) |

---

## 🎨 Telas do App

| Tela | Perfil | Status |
|------|--------|--------|
| Login (e-mail/senha + Google) | Todos | ✅ 100% |
| Cadastro | Todos | ✅ 100% |
| Escolha de Perfil (OAuth) | Todos | ✅ 100% |
| Splash Screen Animada | Todos | ✅ 100% |
| Dashboard do Motorista | Motorista | ✅ 98% |
| Lista de Entregas | Motorista | ✅ 100% |
| Detalhe de Entrega + Confirmação | Motorista | ✅ 100% |
| Mapa GPS + Rota OSRM | Motorista | ✅ 100% |
| Perfil / Mais | Todos | ✅ 100% |
| Dashboard do Coordenador | Coordenador | ⚙️ 85% |
| Detalhe do Motorista | Coordenador | ✅ 100% |
| Painel Administrativo | Dev | ✅ 100% |

O app conta com **modo claro e escuro** com tiles do mapa adaptáveis ao tema.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js (LTS)
- Android Studio com emulador configurado (Pixel 8, API 36 recomendado)
- Conta Firebase com Authentication e Firestore ativados

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/luiseduardoxyz0/LappJ.git

# Entrar na pasta
cd LappJ

# Instalar dependências
npm install

# Rodar o projeto (necessário build nativo por conta dos módulos Firebase e Google Sign-In)
npx expo run:android
```

> ⚠️ **Importante:** Este projeto usa módulos nativos (Firebase, Google Sign-In, expo-notifications). Use `npx expo run:android` em vez de `npx expo start` com Expo Go.

### Contas de Teste

| E-mail | Senha | Perfil |
|--------|-------|--------|
| motorista@lappj.com | motorista123 | Motorista |
| coordenador@lappj.com | coord123 | Coordenador |
| dev@lappj.com | devlappj2026 | Dev / Admin |

---

## 📁 Estrutura de Pastas

```
LappJ/
├── app/
│   ├── _layout.tsx              ← Stack raiz (providers + rotas)
│   ├── index.tsx                ← Splash animada + verificação de sessão Firebase
│   ├── login.js                 ← Auth + botão Google + redirect por perfil
│   ├── register.tsx             ← Cadastro via Firebase Auth + Firestore
│   ├── escolha-perfil.tsx       ← Seleção de perfil para novos usuários OAuth
│   ├── (tabs)/                  ← Abas do Motorista (INÍCIO, ENTREGAS, MAPAS, MAIS)
│   ├── coordenador/             ← Abas do Coordenador (INÍCIO, MAIS)
│   ├── admin/                   ← Abas do Dev (ADMIN, MAIS)
│   ├── entrega/[id].tsx         ← Detalhe de entrega
│   └── motorista/[id].tsx       ← Detalhe de motorista
├── constants/
│   ├── firebaseConfig.js        ← Init Firebase App + Auth com persistência
│   ├── firebaseAuth.js          ← Serviço Auth (signIn, Google, admin, etc.)
│   ├── firestoreService.js      ← CRUD de entregas no Firestore + seed
│   ├── localAuth.js             ← Proxy que re-exporta firebaseAuth.js
│   ├── theme.ts                 ← Paleta de cores (light + dark)
│   ├── ThemeContext.js          ← Provider + hook useTheme() + persistência
│   ├── journeyKeys.ts           ← JOURNEY_KEYS (chaves AsyncStorage)
│   └── EntregasContext.tsx      ← Provider Firestore + optimistic update
├── components/
│   └── more-screen.tsx          ← Tela Mais compartilhada (todos os perfis)
├── google-services.json         ← Config Google Services (Android)
└── app.json                     ← Plugins: location, image-picker, google-signin
```

---

## 🗺️ Roadmap

- [x] **Sprint 1–4** — MVP: auth local, dashboard, jornada, entregas, mapa, admin
- [x] **Sprint 5** — Diagnóstico, bugfixes e reestruturação dos 44 RFs
- [x] **Sprint 6** — Firebase Authentication + Firestore + Login Google
- [x] **Sprint 7** — Notificações locais (expo-notifications) + Rota OSRM no mapa
- [ ] **Fase 2** — Sincronização de jornada em tempo real, notificações push remotas
- [ ] **Fase 3** — Lançamento na Play Store, segurança em produção, testes E2E
- [ ] **Fase 4** — Testes unitários, performance, exportação de relatórios

---

## 👨‍💻 Autor

**Luis Eduardo dos Santos Gonçalves**  
Linguagens e Técnicas de Programação IV — 2026
