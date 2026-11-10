# Estado do Projeto - FinançasPro

Este arquivo registra o contexto confirmado para retomar o desenvolvimento em outra sessão ou com outro agente. Atualizado em 09/11/2026.

## Repositório

- GitHub: `nexuscleo/gestao-de-gastos`
- Branch principal: `main`
- Stack: React 18, Vite 6, Tailwind CSS 4; API Node.js ESM, Express 4, Prisma 6 e MongoDB.

## Estado atual

- O frontend foi publicado no GitHub Pages: https://nexuscleo.github.io/gestao-de-gastos/
- O workflow `.github/workflows/static.yml` compila com `npm ci` e `npm run build`, publica `dist` e roda em pushes para `main` ou manualmente.
- `vite.config.js` define `base: "/gestao-de-gastos/"`, necessário para os assets do GitHub Pages.
- O build local de produção passou em 09/11/2026. A página publicada e seus assets JavaScript/CSS responderam HTTP 200.
- A configuração do backend no Render foi preparada em `render.yaml` e enviada ao GitHub, mas o Blueprint/serviço ainda **não foi criado**. O app público, portanto, ainda não tem uma API de produção conectada.
- O backend usa Prisma/MongoDB e Nodemailer. Não copiar credenciais para o repositório, documentação, issues ou conversas; configurar valores diretamente nos painéis dos provedores.
- `backend/server.js` limita CORS a `FRONTEND_URL` e `http://localhost:5173`. O Blueprint configura a origem `https://nexuscleo.github.io`.
- `backend/src/services/authService.js` agora falha explicitamente em produção se `JWT_SECRET` não estiver configurado.

## Graphify

- Grafo atualizado em 09/11/2026; `GRAPH_REPORT.md`, `graph.json` e `graph.html` foram regenerados. Consulte o relatório para as métricas atuais.
- Diagnóstico estrutural: sem arestas pendentes, endpoints ausentes, auto-loops ou colapsos de arestas.
- Aviso não bloqueante do extrator: dois artefatos Prisma gerados (`query_engine_bg.wasm` e `query_engine_bg.wasm?module`) produzem o mesmo ID; o Graphify manteve um deles e descartou o duplicado. São arquivos gerados, não lógica da aplicação.

## Deploy pendente da API

1. No Render, criar um Blueprint conectado a este repositório e revisar `render.yaml`.
2. Preencher `DATABASE_URL` com a conexão do MongoDB Atlas e `SMTP_HOST`, `SMTP_USER` e `SMTP_PASS` com credenciais SMTP válidas. O Render gera `JWT_SECRET`.
3. Após o deploy, testar a API e copiar sua URL base pública.
4. No GitHub, configurar a variável de Actions `VITE_API_URL` com a URL base da API, sem `/api`.
5. Executar novamente **Deploy to GitHub Pages** em Actions para reconstruir o frontend com essa URL.
6. Testar cadastro, confirmação de e-mail, login, transações e parcelamentos no site publicado.

O plano gratuito do Render pode suspender serviços sem uso. SMTP é necessário para entrega real dos códigos de confirmação e recuperação de senha.

## Desenvolvimento local

```powershell
# Terminal 1, na raiz: frontend em http://localhost:5173
npm run dev

# Terminal 2
cd backend
npm run dev
```

Variáveis locais e segredos ficam em arquivos `.env` ignorados pelo Git. Não os exibir nem os adicionar ao controle de versão.

## Áreas funcionais

- `src/App.jsx`: sessão, estado financeiro, fallback local e operações de dados.
- `src/components/`: autenticação, dashboard, transações, parcelamentos, modais e notificações.
- `src/services/api.js`: chamadas HTTP e token JWT; usa `VITE_API_URL` ou, localmente, `http://localhost:3000`.
- `backend/src/routes/` e `backend/src/services/`: endpoints, autenticação e regras de negócio.
- `backend/prisma/schema.prisma`: modelos `User`, `Transaction` e `InstallmentPlan`.

## Validações recentes

- `npm run build` (raiz): passou em 09/11/2026.
- `node --check backend/server.js`: passou.
- `node --check backend/src/services/authService.js`: passou.
- Workflow do GitHub Pages após configurar o deploy: concluído com sucesso.
- Site e assets em produção: HTTP 200.

## Próxima sessão

Prioridade: concluir o deploy do backend no Render e conectar o frontend à URL pública da API. O Blueprint pede configurar segredos no painel; não há credenciais armazenadas neste repositório. Depois, verificar o fluxo ponta a ponta. Só então retomar as próximas melhorias de produto (metas, relatórios, avatar e testes automatizados).
