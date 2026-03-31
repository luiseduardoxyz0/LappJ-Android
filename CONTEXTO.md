# CONTEXTO DO PROJETO — LappJ

Você vai me ajudar a desenvolver um app chamado **LappJ** em React Native com Expo.
Sempre que eu abrir uma nova conversa, use este arquivo como base de contexto.

---

## Sobre o app

LappJ é um app mobile de **gestão de jornada e entregas** para motoristas e coordenadores de frota.

**Dois perfis de usuário:**
- **Motorista** — registra eventos da jornada, visualiza entregas do dia e navega pelo mapa
- **Coordenador** — monitora cargas ativas, motoristas em rota, atrasos e gerencia cargas

---

## Requisitos Funcionais

- RF01 — Tela de login diferenciando perfil Motorista e Coordenador
- RF02 — Controle de jornada: Início, Almoço, Fim do Almoço, Espera, Fim da Espera, Fim da Jornada
- RF03 — Lista de entregas do dia com cliente, pedido, endereço, ETA e status
- RF04 — Mapa integrado com rota até o ponto de entrega (Google Maps API)
- RF05 — Painel do coordenador com visualização e gestão de cargas e motoristas

## Requisitos Não Funcionais

- RNF01 — Android (Expo + React Native)
- RNF02 — Permissão de GPS para mapa
- RNF03 — Conexão com internet para sincronizar dados com API/backend

---

## Stack tecnológica

- **Framework:** React Native com Expo
- **Navegação:** React Navigation (Stack + Bottom Tabs)
- **Tema:** Context API (modo claro e escuro)
- **Backend:** A definir (provavelmente Firebase)
- **Mapas:** react-native-maps + Google Maps API

---

## Identidade Visual

### Cores principais

| Nome | Claro | Escuro |
|---|---|---|
| Background | #F0F2F8 | #0A0E1A |
| Surface (cards) | #FFFFFF | #141828 |
| Surface secundário | #F5F6FA | #1C2235 |
| Primary (azul escuro) | #1A237E | #5C7CFA |
| Accent (laranja) | #F5A623 | #F5A623 |
| Texto principal | #1A237E | #FFFFFF |
| Texto secundário | #5C6BC0 | #8899CC |
| Texto mudo | #9E9E9E | #556688 |
| Input background | #EEEEEE | #1C2235 |
| Borda | #E8EAF6 | #1E2A45 |

### Status das entregas

| Status | Cor | Label |
|---|---|---|
| Em trânsito | #F5A623 | EM TRÂNSITO |
| Pendente | #9E9E9E | PENDENTE |
| Entregue | #3949AB / #5C7CFA | ENTREGUE |

### Tipografia

- Fontes do sistema (sem fontes externas por enquanto)
- Títulos: fontWeight 700
- Labels de seção: fontSize 11, letterSpacing 2, maiúsculas
- Corpo: fontSize 14–15
- Subtítulos de cards: fontSize 12–13, cor secundária

---

## Estrutura de pastas do projeto

```
LappJ/
├── App.js
└── src/
    ├── theme/
    │   ├── colors.js           ← Paleta de cores modo claro e escuro
    │   └── ThemeContext.js     ← Provider e hook useTheme()
    ├── navigation/
    │   └── AppNavigator.js     ← Stack + Tab navigator
    └── screens/
        ├── LoginScreen.js
        ├── DashboardMotoristaScreen.js
        ├── ListaEntregasScreen.js
        ├── MapaScreen.js
        └── CoordenadorScreen.js
```

---

## Telas do app

### 1. LoginScreen
- Logo LappJ com ícone de caminhão
- Subtítulo: "GESTÃO DE JORNADA E ENTREGAS"
- Seletor de perfil: Motorista | Coordenador (toggle style)
- Campo e-mail corporativo
- Campo senha com botão mostrar/ocultar
- Botão "Entrar na Jornada →"
- Divisor "OU CONTINUE COM"
- Botões Google e Microsoft
- Link "Contate o Suporte Fleet"
- Rodapé com versão

### 2. DashboardMotoristaScreen (aba INÍCIO do motorista)
- Header com avatar, nome "João da Silva", status "Em Jornada"
- Ícones de GPS, Wi-Fi, notificação
- Relógio digital em tempo real (HH:MM com segundos menores)
- Data atual por extenso
- Card de status da jornada com indicador verde
- 2 cards lado a lado: Horas Trabalhadas e Entregas Concluídas
- Seção "AÇÕES DE CONTROLE"
- Botão "Iniciar Jornada" desabilitado (já registrado)
- Grid 2x2: Iniciar Almoço (laranja), Fim do Almoço, Iniciar Espera (cinza), Fim da Espera
- Botão "Fim da Jornada" (azul escuro, largura total)
- Card "PRÓXIMA PARADA" com nome e endereço

### 3. ListaEntregasScreen (aba ENTREGAS)
- Header com avatar e título "Entregas do Dia"
- Campo de busca "Buscar cliente ou pedido..."
- Lista de cards de entrega com:
  - Borda esquerda colorida conforme status
  - Nome do cliente + número do pedido
  - Badge de status (EM TRÂNSITO / PENDENTE / ENTREGUE)
  - Ícone de pin + endereço completo
  - ETA ou horário de finalização
  - Seta "›" para entregas abertas

### 4. MapaScreen (aba MAPAS)
- Header com avatar e título "LappJ"
- Mapa ocupando a maior parte da tela
- Marcador azul escuro com ícone de caminhão (posição atual)
- Marcador laranja com ícone de pin (destino)
- Tooltip com nome do destino
- Card inferior com:
  - Label "PRÓXIMA PARADA" em laranja
  - Nome do destino em destaque
  - Distância em km e tempo estimado
  - Botão "INICIAR GPS" (largura quase total)
  - Botão de telefone

### 5. CoordenadorScreen (tela do coordenador)
- Header com título "LappJ", sino com badge laranja, avatar
- 3 cards de métricas com borda esquerda colorida:
  - Cargas Ativas (azul)
  - Motoristas em Rota (azul claro)
  - Atrasos Críticos (laranja/amarelo)
- Campo de busca
- Botões "Filtros" e "Nova Carga" lado a lado
- Tabela de motoristas com:
  - Avatar, nome e placa
  - Status colorido com ponto indicador
  - Barra de progresso

---

## Padrões de código a seguir

```js
// Sempre usar o hook useTheme para acessar as cores
const { theme, isDark, toggleTheme } = useTheme();

// Sempre gerar styles como função que recebe theme e isDark
const s = styles(theme, isDark);
const styles = (theme, isDark) => StyleSheet.create({ ... });

// Navegação: usar navigation.replace() para Login→App (sem voltar)
// Usar navigation.navigate() para ir entre telas internas
```

---

## Como me pedir ajuda

Quando for pedir uma tela ou componente, use este formato:

> "Crie o [NomeDaTela].js seguindo o padrão do projeto e fiel ao design [descreva ou anexe a imagem]"

Para corrigir algo:

> "No [NomeDaTela].js, corrija [o que está errado]"

Para adicionar funcionalidade:

> "No [NomeDaTela].js, adicione [funcionalidade]"

---

## ⚠️ REGRAS CRÍTICAS DE DESENVOLVIMENTO

### Terminal e Servidor Expo

**NUNCA fazer:**
- ❌ Tentar executar comandos em múltiplos terminais diferentes
- ❌ Reiniciar o servidor por conta própria
- ❌ Criar novos terminais para limpar a porta ou resetar

**SEMPRE fazer:**
- ✅ Usar um único terminal durante toda a conversa
- ✅ Manter o servidor rodando na **porta 8081**
- ✅ Apenas fornecer os comandos necessários e esperar o usuário executá-los
- ✅ Usar `r` ou `rr` no terminal do Expo para reload quando precisar

**Por quê?** Quando múltiplos terminais iniciam o Expo, cada um tenta usar a porta 8081, criando conflitos e usando várias portas diferentes (8082, 8083, etc), causando desorganização e erros de conexão.

---

*Última atualização: 2026 — Projeto LappJ*
