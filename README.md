# 💰 FinançasPro - Gestão de Gastos & Parcelamentos

> Aplicação fullstack de controle financeiro pessoal, parcelamentos/financiamentos e projeção orçamentária, com arquitetura modular e persistência em nuvem (MongoDB Atlas).

---

## 📌 Status Atual do Projeto

- **Versão:** 1.2.0 (Autenticação Completa & Arquitetura Modular)
- **Data da Atualização:** 08/11/2026
- **Status do Build:** 100% aprovado (Vite v6 & Node ESM)
- **Banco de Dados:** Conectado ao MongoDB Atlas (banco `gestao_gastos`) via Prisma ORM 6.19.

---

## 🏗️ Arquitetura do Sistema

```
gestao-de-gastos/
├── backend/                              # Servidor Node.js + Express
│   ├── prisma/
│   │   └── schema.prisma                 # Modelos MongoDB: User, Transaction, InstallmentPlan
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js                 # Singleton do PrismaClient
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js         # Proteção e extração de JWT (Bearer Token)
│   │   │   └── errorHandler.js           # Tratamento centralizado de erros REST
│   │   ├── services/
│   │   │   ├── authService.js            # Lógica de login, hash bcrypt, tokens de verificação e reset
│   │   │   ├── emailService.js           # Envio de emails (Nodemailer c/ fallback dev)
│   │   │   ├── userService.js            # Regras e busca de usuários
│   │   │   ├── transactionService.js     # CRUD e queries de receitas/despesas
│   │   │   └── installmentService.js     # Pagamento e acompanhamento de parcelas
│   │   └── routes/
│   │       └── index.js                  # Endpoints RESTful (/api/auth, /api/transactions, etc.)
│   ├── server.js                         # Inicialização do Express, CORS e portas
│   └── .env                              # String de conexão MongoDB Atlas e segredos JWT
│
├── src/                                  # Frontend React 18 + Tailwind CSS 4 + Vite
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthPage.jsx              # Portal seguro de Login, Cadastro, Validação de Código e Recuperação
│   │   ├── modals/
│   │   │   ├── TransactionModal.jsx      # Modal de inserção de receitas/despesas
│   │   │   └── InstallmentModal.jsx      # Modal de criação de planos de parcelamento
│   │   ├── DashboardTab.jsx              # Cards de saldo, receitas, despesas e gráficos Recharts
│   │   ├── TransactionsTab.jsx           # Tabela com busca em tempo real, filtro mensal e exportação CSV
│   │   ├── InstallmentsTab.jsx           # Gestão de parcelas a vencer, status e quitação
│   │   ├── Header.jsx                    # Barra superior com status da nuvem e dados do usuário logado
│   │   └── Toast.jsx                     # Sistema global de notificações e feedback de UX
│   ├── services/
│   │   └── api.js                        # Cliente HTTP Fetch com injeção automática de JWT
│   ├── utils/
│   │   └── financeUtils.js               # Formatações BRL, datas pt-BR, cálculo de parcelas e helpers
│   ├── App.jsx                           # Orquestrador com proteção de rota (Guest vs Autenticado)
│   └── index.css                         # Configurações de design e tipografia
│
└── graphify-out/                         # Base de conhecimento e grafo arquitetural do Graphify
```

---

## 🔒 Fluxo de Autenticação & Acesso

1. **Acesso Bloqueado por Padrão:**
   - Usuários não logados têm acesso exclusivamente à [`src/components/auth/AuthPage.jsx`](src/components/auth/AuthPage.jsx).
2. **Cadastro & Confirmação de E-mail:**
   - Senha criptografada com `bcryptjs` (salt 10).
   - Envio de código de 6 dígitos via [`emailService.js`](backend/src/services/emailService.js).
   - O login é bloqueado até a confirmação do e-mail (`emailVerified: true`).
3. **Sessão JWT:**
   - Token assinado de 7 dias armazenado no `localStorage` e anexado em todas as chamadas à API.
4. **Recuperação de Senha:**
   - Geração de código de uso único com expiração de 30 minutos enviada por e-mail.

---

## 🚀 Como Executar o Projeto

### 1. Iniciar o Backend
```bash
cd backend
npm run dev
```
*Porta padrão: `http://localhost:3000`*

### 2. Iniciar o Frontend
```bash
npm run dev
```
*Acesse no navegador: `http://localhost:5173`*

## 🌐 Publicação no GitHub Pages

O workflow `.github/workflows/static.yml` compila o frontend com Vite e publica o conteúdo de `dist` no GitHub Pages a cada push para `main`. O endereço do projeto é:

**https://nexuscleo.github.io/gestao-de-gastos/**

No GitHub, em **Settings → Pages**, selecione **GitHub Actions** como origem da publicação. Depois, acompanhe a execução em **Actions**.

O Pages hospeda somente o frontend estático; a API Node.js e o MongoDB não são publicados por esse workflow. Para habilitar login, cadastro e persistência no endereço público, hospede o backend separadamente e cadastre a URL pública dele como variável `VITE_API_URL` em **Settings → Secrets and variables → Actions → Variables**. O backend também precisa permitir requisições CORS da origem `https://nexuscleo.github.io`.

---

## 📋 Próximos Passos Planejados para a Próxima Sessão

- [ ] Configuração de serviço SMTP real de produção (Resend / SendGrid / Amazon SES) no `.env`.
- [ ] Implementação de upload de avatar ou perfil do usuário.
- [ ] Relatórios em PDF / Dashboard com metas de economia.
- [ ] Testes automatizados (Jest / Vitest) para as regras financeiras e endpoints de autenticação.
