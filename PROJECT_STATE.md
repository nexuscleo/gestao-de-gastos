# 🤖 PROJECT_STATE.md - Contexto para Agentes de IA

> Este arquivo serve como ponto de partida e estado consolidado para qualquer agente de IA ou desenvolvedor que retomar o desenvolvimento deste projeto.

---

## 📍 Localização e Repositório
- **Diretório Raiz:** `c:\Users\clrtj\Desktop\gestao-de-gastos`
- **Backend:** `c:\Users\clrtj\Desktop\gestao-de-gastos\backend`
- **Referência Original utilizada:** `C:\Users\clrtj\Desktop\DevClub\backend\node`

---

## 🎯 Onde o Projeto Está Exatamente

1. **Frontend (`/src`):**
   - **Framework:** React 18, Vite 6, Tailwind CSS 4, Lucide Icons, Recharts.
   - **Controle de Acesso:** A [`src/components/auth/AuthPage.jsx`](file:///c:/Users/clrtj/Desktop/gestao-de-gastos/src/components/auth/AuthPage.jsx) isola completamente o login, cadastro, confirmação de código de 6 dígitos e recuperação de senha. O painel financeiro só é montado após a autenticação bem-sucedida.
   - **Modularidade:** Todos os componentes foram extraídos do antigo `App.jsx` monolítico para componentes dedicados em `src/components/` (`DashboardTab.jsx`, `TransactionsTab.jsx`, `InstallmentsTab.jsx`, `TransactionModal.jsx`, `InstallmentModal.jsx`, `Header.jsx`, `Toast.jsx`).
   - **Funcionalidades de UX:** Busca em tempo real, filtro por mês/ano, exportação de transações para planilha CSV, responsividade mobile completa (com scroll seguro e tamanhos touch amigáveis) e notificações Toast instantâneas.

2. **Backend (`/backend`):**
   - **Framework:** Node.js (ESM), Express 4, Prisma 6.19, MongoDB Atlas.
   - **Banco Ativo:** MongoDB Atlas (Cluster `users.qgmfsky.mongodb.net`, database `gestao_gastos`).
   - **Modelos:**
     - `User`: email, password (bcrypt), name, emailVerified, verificationToken, resetPasswordToken, resetPasswordExpires.
     - `Transaction`: userId, description, amount, type, category, date, installmentId.
     - `InstallmentPlan`: userId, description, type, category, amount, installmentCount, firstDueDate, installments (embedded array).
   - **Segurança:** `authMiddleware.js` com JWT (`Bearer token`), `errorHandler.js` centralizado, hash com `bcryptjs`.
   - **Serviço de Email:** `emailService.js` com Nodemailer (configuração SMTP no `.env` e simulação no console para desenvolvimento).

3. **Graphify:**
   - Base de conhecimento atualizada com sucesso (`graphify cluster-only .` gerou 15 comunidades e sincronizou `graphify-out/graph.json`, `graphify-out/graph.html` e `graphify-out/GRAPH_REPORT.md`).

---

## 🛠️ Comandos para Continuar o Projeto

```powershell
# Rodar o backend
cd backend
npm run dev

# Rodar o frontend (em outro terminal na raiz)
npm run dev
```

---

## 💡 Próximas Tarefas Recomendadas
1. Testar o fluxo completo de cadastro com envio e validação de código de confirmação.
2. Adicionar filtros por período personalizado no Dashboard.
3. Implementar metas mensais de gastos por categoria.
