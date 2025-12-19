# Kanban Rony Game

Estrutura do projeto (organizada):

- css/
  - `styles.css` — estilos principais do board
# Kanban Rony Game

Estrutura do projeto (organizada):

- css/
  - `styles.css` — estilos principais do board
- src/
  - `storage.js` — helpers para salvar/carregar estado (`localStorage`)
  - `cards.js` — criação de cards e comportamento dos indicadores
  - `dragdrop.js` — lógica de drag & drop (drop zones)
  - `main.js` — inicialização do app, UI wiring (botões, render)
- index.html

## Como abrir

1. Abra o arquivo `index.html` no navegador (duplo-clique ou via terminal):

```powershell
start index.html
```

## Funcionamento rápido

- Botão `Iniciar`: adiciona um card ao `Backlog` com ID sequencial.
- Botão `Reiniciar`: limpa o estado salvo e recria o card inicial.
- Indicadores: quatro indicadores (Refinamento, Fazendo, Homologando, Ajustes) com valor aleatório 1–18; clique em um indicador para gerar novo valor aleatório.
- Arraste e solte cards entre colunas; o estado é salvo automaticamente em `localStorage`.

## Desenvolvimento

- Os scripts estão em `src/` para facilitar modularização. Ao desenvolver, edite os arquivos em `src/`.
- Para estender: adicione módulos JS e atualize `index.html` carregando-os na ordem correta (storage → cards → dragdrop → main).

## Lint (ESLint)

Para checar o código com `ESLint`:

1. Instale as dependências (no Windows PowerShell):

```powershell
npm install
```

2. Rodar o lint:

```powershell
npm run lint
# ou para aplicar correções automáticas
npm run lint:fix
```

Arquivos de configuração adicionados: `.eslintrc.json`, `.eslintignore` e `package.json` (script `lint`).
