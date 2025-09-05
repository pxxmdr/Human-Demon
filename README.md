# Demon Slayer — Front Mobile (FIAP)

Projeto desenvolvido para a disciplina de **Front Mobile** (FIAP).
O objetivo é construir um app em **React Native + Expo** que consome a API pública de personagens de *Demon Slayer* e exibe:

- **Lista** com os 45 personagens (nome e imagem);
- **Detalhes** do personagem selecionado (imagem, nome, idade, raça, gênero, descrição e citação);
- **Fundo dinâmico** na tela de detalhes: muda conforme a raça (Human / Demon).

> **Stack**: Expo, React Native, TypeScript e React Navigation.

---

## 🧱 Estrutura do projeto

```
.
├── assets/
│   ├── background-demon.png
│   ├── background-human.png
│   └── logo.png
├── src/
│   ├── api.ts
│   ├── types.ts
│   └── screens/
│       ├── CharacterListScreen.tsx
│       └── CharacterDetailScreen.tsx
├── App.tsx
├── index.ts
├── app.json
└── tsconfig.json
```

---

## ▶️ Executando o app

> Pré‑requisitos:
> - Node LTS e npm (ou yarn/pnpm)
> - **Expo CLI** (`npx expo`)
> - Emulador Android/iOS ou **Expo Go** no celular

### 1) Instalar dependências
```bash
npm install
```

Os principais pacotes:
```bash
# navegação
npm install @react-navigation/native @react-navigation/native-stack
# deps da navegação
npx expo install react-native-screens react-native-safe-area-context
# expo (se necessário)
npx expo install
```

### 2) Rodar em desenvolvimento
```bash
npm start
# depois, pressione:
#   a  -> abrir Android
#   i  -> abrir iOS (macOS)
#   w  -> abrir web
```

Ou escaneie o QR Code com **Expo Go**.

> Dica: se usar emulador Android e a API não responder, garanta que o emulador está com internet e tente `r` (reload). Em alguns casos, redes corporativas bloqueiam HTTPS de APIs públicas.

---

## 🔌 API

- Endpoint principal utilizado:
  `https://www.demonslayer-api.com/api/v1/characters`

### `src/api.ts` (resumo)
- `fetchCharacters(limit?: number)`: busca a lista (usa `?limit=45` no projeto).
- `fetchCharacterById(id)`: busca os detalhes por `?id={id}`.

> O código lida com tempo de *timeout* e mensagens de erro amigáveis no app.

---

## 🖼️ Assets

- `assets/background-human.png` → aplicado para **Human**
- `assets/background-demon.png` → aplicado para **Demon**
- `assets/logo.png` → exibida na listagem

> As imagens de personagens vêm **da própria API** (campo `img`). Para manter o efeito “personagem flutuando”, o `resizeMode="contain"` é usado e evitamos `backgroundColor` no `Image` do personagem.

---



## 👤 Autor

- **Pedro Henrique Martins dos Reis** — Rm555306 
- **FIAP — Front Mobile**
- GitHub: https://github.com/seu-usuario
