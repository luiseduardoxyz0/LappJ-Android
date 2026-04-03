# 🚚 LappJ — Gestão de Jornada e Entregas

> Projeto desenvolvido para a disciplina de **Linguagens e Técnicas de Programação IV**

---

## 📱 Sobre o Projeto

O **LappJ** é um aplicativo mobile de gestão de jornada e entregas voltado para motoristas e coordenadores de frota. O app permite o controle em tempo real da jornada de trabalho, acompanhamento de entregas do dia e visualização de rotas no mapa.

---

## 👥 Perfis de Usuário

### 🚛 Motorista
- Registra eventos da jornada (início, almoço, espera e fim)
- Visualiza a lista de entregas do dia com status em tempo real
- Navega pelo mapa até os pontos de entrega

### 🗂️ Coordenador
- Monitora cargas ativas e motoristas em rota
- Visualiza atrasos críticos
- Gerencia e cria novas cargas

---

## ✅ Requisitos Funcionais

| ID | Descrição |
|----|-----------|
| RF01 | Autenticação com diferenciação entre perfil Motorista e Coordenador |
| RF02 | Controle de jornada: Início, Almoço, Fim do Almoço, Espera, Fim da Espera e Fim da Jornada |
| RF03 | Listagem de entregas do dia com cliente, pedido, endereço, ETA e status |
| RF04 | Mapa integrado com rota até o ponto de entrega |
| RF05 | Painel do coordenador com visualização e gestão de cargas e motoristas |

## ⚙️ Requisitos Não Funcionais

| ID | Descrição |
|----|-----------|
| RNF01 | Desenvolvido para Android com React Native + Expo |
| RNF02 | Permissão de GPS para funcionamento do mapa |
| RNF03 | Conexão com internet para sincronização de dados com a API |

---

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🎨 Telas do App

| Tela | Descrição |
|------|-----------|
| Login | Autenticação com seleção de perfil |
| Dashboard Motorista | Relógio, status da jornada e ações de controle |
| Lista de Entregas | Entregas do dia com status e ETA |
| Mapa | Navegação até o ponto de entrega |
| Painel Coordenador | Métricas e gestão de motoristas |

O app conta com **modo claro e escuro**.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js (LTS)
- Expo CLI
- Android Studio com emulador configurado

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/luiseduardoxyz0/LappJ-Android.git

# Entrar na pasta
cd LappJ-Android

# Instalar dependências
npm install

# Rodar o projeto
npx expo start
```

Pressione **`a`** para abrir no emulador Android.

---

## 📁 Estrutura de Pastas

```
LappJ/
├── app/                    ← Telas do app (file-based routing)
├── src/
│   ├── components/         ← Componentes reutilizáveis
│   ├── constants/          ← Cores e constantes
│   └── hooks/              ← Hooks customizados
├── assets/                 ← Imagens e ícones
├── documentacao/           ← Requisitos do projeto
└── visual idealizado/      ← Design de referência das telas
```

---

## 👨‍💻 Autor

**Luis Eduardo dos Santos Gonçalves**  
Linguagens e Técnicas de Programação IV — 2026
