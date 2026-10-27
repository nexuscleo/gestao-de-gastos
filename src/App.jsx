
import { useState, useEffect, useRef } from "react";
import { PlusCircle, Trash2, TrendingUp, TrendingDown, Wallet, BarChart3, ArrowLeftRight, CalendarClock, Check, CircleDollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const COLORS = ["#10B981", "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

const CATEGORIES_INCOME = ["Salário", "Freelance", "Investimentos", "Outros"];
const CATEGORIES_EXPENSE = ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Lazer", "Contas", "Outros"];

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function todayISODate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addMonths(dateString, monthOffset) {
  const [year, month, day] = dateString.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1 + monthOffset, 1));
  const lastDay = new Date(Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0)).getUTCDate();
  firstDay.setUTCDate(Math.min(day, lastDay));
  return firstDay.toISOString().slice(0, 10);
}

function isValidPlan(plan) {
  return (
    plan !== null &&
    typeof plan === "object" &&
    typeof plan.id === "string" &&
    plan.id.length > 0 &&
    typeof plan.description === "string" &&
    plan.description.trim().length > 0 &&
    ["installment", "financing"].includes(plan.type) &&
    CATEGORIES_EXPENSE.includes(plan.category) &&
    Number.isFinite(plan.amount) &&
    plan.amount >= 0.01 &&
    plan.amount <= 999999999 &&
    Number.isSafeInteger(plan.installmentCount) &&
    plan.installmentCount > 0 &&
    plan.installmentCount <= 600 &&
    isValidDate(plan.firstDueDate) &&
    typeof plan.cancelled === "boolean" &&
    Array.isArray(plan.installments) &&
    plan.installments.length === plan.installmentCount &&
    plan.installments.every((installment, index) =>
      installment !== null &&
      typeof installment === "object" &&
      installment.number === index + 1 &&
      installment.dueDate === addMonths(plan.firstDueDate, index) &&
      (installment.paidAt === null || isValidDate(installment.paidAt)) &&
      (installment.transactionId === null || (typeof installment.transactionId === "string" && installment.transactionId.length > 0))
    )
  );
}

function loadPlans() {
  let saved;

  try {
    saved = window.localStorage.getItem("finance_installment_plans");
  } catch {
    return { plans: [], error: "Não foi possível acessar os parcelamentos salvos neste navegador." };
  }

  if (!saved) {
    return { plans: [], error: "" };
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid installment plan storage format");
    }

    const plans = parsed.filter(isValidPlan);
    return {
      plans,
      error: plans.length === parsed.length
        ? ""
        : "Alguns parcelamentos salvos eram inválidos e não foram carregados.",
    };
  } catch {
    return {
      plans: [],
      error: "Os parcelamentos salvos estão ilegíveis. Ao cadastrar um novo, eles serão substituídos.",
    };
  }
}

function isValidTransaction(transaction) {
  if (!transaction || typeof transaction !== "object" || Array.isArray(transaction)) {
    return false;
  }

  const categories = transaction.type === "income"
    ? CATEGORIES_INCOME
    : transaction.type === "expense"
      ? CATEGORIES_EXPENSE
      : [];
  return (
    ((Number.isSafeInteger(transaction.id) && transaction.id > 0) ||
      (typeof transaction.id === "string" && transaction.id.length > 0)) &&
    typeof transaction.description === "string" &&
    transaction.description.trim().length > 0 &&
    Number.isFinite(transaction.amount) &&
    transaction.amount > 0 &&
    categories.includes(transaction.category) &&
    isValidDate(transaction.date) &&
    (transaction.installmentId === undefined ||
      (typeof transaction.installmentId === "string" &&
        Number.isSafeInteger(transaction.installmentNumber) &&
        transaction.installmentNumber > 0))
  );
}

function loadTransactions() {
  let saved;

  try {
    saved = window.localStorage.getItem("finance_transactions");
  } catch {
    return {
      transactions: [],
      error: "Não foi possível acessar o armazenamento local deste navegador.",
    };
  }

  if (!saved) {
    return { transactions: [], error: "" };
  }

  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch {
    return {
      transactions: [],
      error: "Os dados salvos estão ilegíveis. Ao salvar uma nova transação, eles serão substituídos.",
    };
  }

  if (!Array.isArray(parsed)) {
    return {
      transactions: [],
      error: "Os dados salvos têm um formato inválido. Ao salvar uma nova transação, eles serão substituídos.",
    };
  }

  const transactions = parsed.filter(isValidTransaction);
  const hasInvalidTransactions = transactions.length !== parsed.length;

  return {
    transactions,
    error: hasInvalidTransactions
      ? "Algumas transações salvas eram inválidas e não foram carregadas."
      : "",
  };
}

export default function FinanceApp() {
  const [initialData] = useState(loadTransactions);
  const [initialPlans] = useState(loadPlans);
  const [transactions, setTransactions] = useState(initialData.transactions);
  const [plans, setPlans] = useState(initialPlans.plans);
  const [storageError, setStorageError] = useState([initialData.error, initialPlans.error].filter(Boolean).join(" "));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const paymentLocks = useRef(new Set());
  const [planForm, setPlanForm] = useState({
    description: "",
    type: "installment",
    amount: "",
    installmentCount: "",
    category: "Contas",
    firstDueDate: todayISODate(),
  });
  const [formData, setFormData] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: "",
    date: todayISODate(),
  });

  useEffect(() => {
    if (transactions === initialData.transactions) {
      return;
    }

    try {
      window.localStorage.setItem("finance_transactions", JSON.stringify(transactions));
      setStorageError("");
    } catch {
      setStorageError("Não foi possível salvar as transações no armazenamento local deste navegador.");
    }
  }, [initialData.transactions, transactions]);

  useEffect(() => {
    if (plans === initialPlans.plans) {
      return;
    }

    try {
      window.localStorage.setItem("finance_installment_plans", JSON.stringify(plans));
      setStorageError("");
    } catch {
      setStorageError("Não foi possível salvar os parcelamentos no armazenamento local deste navegador.");
    }
  }, [initialPlans.plans, plans]);

  useEffect(() => {
    paymentLocks.current.clear();
  }, [plans]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "type") {
        updated.category = "";
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.date) return;

    const newTransaction = {
      id: createId(),
      type: formData.type,
      description: formData.description,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setFormData({
      type: "expense",
      description: "",
      amount: "",
      category: "",
      date: todayISODate(),
    });
    setShowForm(false);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setPlans((prev) => prev.map((plan) => ({
      ...plan,
      installments: plan.installments.map((installment) =>
        installment.transactionId === id
          ? { ...installment, paidAt: null, transactionId: null }
          : installment
      ),
    })));
  };

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    const amount = Math.round(Number(planForm.amount) * 100) / 100;
    const installmentCount = Number(planForm.installmentCount);

    if (
      !planForm.description.trim() ||
      !Number.isFinite(amount) ||
      amount < 0.01 ||
      amount > 999999999 ||
      !Number.isSafeInteger(installmentCount) ||
      installmentCount < 1 ||
      installmentCount > 600 ||
      !CATEGORIES_EXPENSE.includes(planForm.category) ||
      !isValidDate(planForm.firstDueDate)
    ) {
      return;
    }

    const plan = {
      id: createId(),
      description: planForm.description.trim(),
      type: planForm.type,
      amount,
      installmentCount,
      category: planForm.category,
      firstDueDate: planForm.firstDueDate,
      cancelled: false,
      installments: Array.from({ length: installmentCount }, (_, index) => ({
        number: index + 1,
        dueDate: addMonths(planForm.firstDueDate, index),
        paidAt: null,
        transactionId: null,
      })),
    };

    setPlans((prev) => [plan, ...prev]);
    setPlanForm({
      description: "",
      type: "installment",
      amount: "",
      installmentCount: "",
      category: "Contas",
      firstDueDate: todayISODate(),
    });
    setShowPlanForm(false);
  };

  const payNextInstallment = (planId) => {
    if (paymentLocks.current.has(planId)) {
      return;
    }

    const plan = plans.find((item) => item.id === planId);
    const installment = plan?.installments.find((item) => item.paidAt === null);
    if (!plan || !installment || plan.cancelled) {
      return;
    }

    paymentLocks.current.add(planId);
    const transactionId = createId();
    const paidAt = todayISODate();
    setTransactions((prev) => [{
      id: transactionId,
      type: "expense",
      description: `${plan.description} (${installment.number}/${plan.installmentCount})`,
      amount: plan.amount,
      category: plan.category,
      date: paidAt,
      installmentId: plan.id,
      installmentNumber: installment.number,
    }, ...prev]);
    setPlans((prev) => prev.map((item) => item.id === planId
      ? {
          ...item,
          installments: item.installments.map((entry) => entry.number === installment.number
            ? { ...entry, paidAt, transactionId }
            : entry),
        }
      : item
    ));
  };

  const cancelPlan = (planId) => {
    setPlans((prev) => prev.map((plan) => plan.id === planId
      ? { ...plan, cancelled: true }
      : plan
    ));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
  };

  const categories = formData.type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;

  const pieData = categories.map((cat) => ({
    name: cat,
    value: transactions
      .filter((t) => t.category === cat && t.type === formData.type)
      .reduce((sum, t) => sum + t.amount, 0),
  })).filter((d) => d.value > 0);

  const expensePieData = CATEGORIES_EXPENSE.map((cat) => ({
    name: cat,
    value: transactions
      .filter((t) => t.category === cat && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
  })).filter((d) => d.value > 0);

  const monthlyData = (() => {
    const months = {};
    transactions.forEach((t) => {
      const month = t.date.substring(0, 7);
      if (!months[month]) months[month] = { month, income: 0, expense: 0 };
      months[month][t.type] += t.amount;
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  })();

  const today = todayISODate();
  const activePlans = plans.filter((plan) =>
    !plan.cancelled && plan.installments.some((installment) => installment.paidAt === null)
  );
  const outstandingCents = activePlans.reduce((sum, plan) =>
    sum + Math.round(plan.amount * 100) * plan.installments.filter((installment) => installment.paidAt === null).length
  , 0);
  const outstandingTotal = outstandingCents / 100;
  const pendingInstallmentCount = activePlans.reduce((sum, plan) =>
    sum + plan.installments.filter((installment) => installment.paidAt === null).length
  , 0);
  const upcomingInstallments = activePlans
    .map((plan) => ({
      plan,
      installment: plan.installments.find((item) => item.paidAt === null),
    }))
    .filter((item) => item.installment)
    .sort((a, b) => a.installment.dueDate.localeCompare(b.installment.dueDate));
  const nextInstallment = upcomingInstallments[0];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">FinançasPro</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow"
          >
            <PlusCircle className="w-5 h-5" />
            Nova Transação
          </button>
        </div>
      </header>

      <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {[
            { id: "dashboard", label: "Painel", icon: BarChart3 },
            { id: "transactions", label: "Transações", icon: ArrowLeftRight },
            { id: "installments", label: "Parcelamentos", icon: CalendarClock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {storageError && (
          <p role="alert" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            {storageError}
          </p>
        )}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Saldo Total</span>
                  <Wallet className="w-5 h-5 text-gray-400" />
                </div>
                <p className={`text-3xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Receitas</span>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Despesas</span>
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-red-500">{formatCurrency(totalExpense)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Receitas vs Despesas (Mensal)</h3>
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                      />
                      <Legend />
                      <Bar dataKey="income" name="Receitas" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-72 flex items-center justify-center text-gray-400">
                    Adicione transações para ver o gráfico
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Despesas por Categoria</h3>
                {expensePieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expensePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-72 flex items-center justify-center text-gray-400">
                    Nenhuma despesa registrada
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Últimas Transações</h3>
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nenhuma transação encontrada. Comece adicionando uma!</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {transactions.slice(0, 5).map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          t.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                        }`}>
                          {t.type === "income" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{t.description}</p>
                          <p className="text-sm text-gray-500">{t.category} • {formatDate(t.date)}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                        {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Todas as Transações</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {transactions.length} registros
              </span>
            </div>
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma transação registrada ainda.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        t.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                      }`}>
                        {t.type === "income" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{t.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t.category}</span>
                          <span className="text-xs text-gray-400">{formatDate(t.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-bold text-lg ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                        {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                      </p>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir transação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "installments" && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Parcelamentos e financiamentos</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Acompanhe os vencimentos e registre cada parcela quando pagar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPlanForm(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <PlusCircle className="h-5 w-5" />
                Novo parcelamento
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Total a vencer</p>
                <p className="mt-2 text-2xl font-bold text-gray-800">{formatCurrency(outstandingTotal)}</p>
                <p className="mt-1 text-xs text-gray-400">Parcelas futuras em planos ativos</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Próximo vencimento</p>
                <p className="mt-2 text-2xl font-bold text-gray-800">
                  {nextInstallment ? formatDate(nextInstallment.installment.dueDate) : "Nenhum"}
                </p>
                <p className="mt-1 truncate text-xs text-gray-400">
                  {nextInstallment?.plan.description ?? "Cadastre uma conta parcelada"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Planos ativos</p>
                <p className="mt-2 text-2xl font-bold text-gray-800">{activePlans.length}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {pendingInstallmentCount} parcela(s) a pagar
                </p>
              </div>
            </div>

            {plans.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                <CalendarClock className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-800">Nenhuma despesa parcelada cadastrada</h3>
                <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
                  Cadastre uma conta ou financiamento para acompanhar as parcelas. Elas só entram nas despesas e no saldo quando você registrar o pagamento.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPlanForm(true)}
                  className="mt-5 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
                >
                  Cadastrar primeira despesa
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {plans.map((plan) => {
                  const paidCount = plan.installments.filter((item) => item.paidAt !== null).length;
                  const next = plan.installments.find((item) => item.paidAt === null);
                  const cancelled = plan.cancelled;
                  const completed = !next && !cancelled;
                  const overdue = next && next.dueDate < today;
                  const progress = Math.round((paidCount / plan.installmentCount) * 100);

                  return (
                    <article key={plan.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-800">{plan.description}</h3>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              cancelled
                                ? "bg-gray-100 text-gray-600"
                                : completed
                                  ? "bg-emerald-100 text-emerald-700"
                                  : overdue
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-50 text-blue-700"
                            }`}>
                              {cancelled ? "Encerrado" : completed ? "Concluído" : overdue ? "Vencido" : "Em andamento"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {plan.type === "financing" ? "Financiamento" : "Conta parcelada"} · {plan.category}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xl font-bold text-gray-800">{formatCurrency(plan.amount)}</p>
                          <p className="text-sm text-gray-500">por parcela · {plan.installmentCount} no total</p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-600">{paidCount} de {plan.installmentCount} pagas</span>
                          <span className="font-semibold text-gray-700">{progress}%</span>
                        </div>
                        <div
                          className="h-2 overflow-hidden rounded-full bg-gray-100"
                          role="progressbar"
                          aria-label={`Progresso de ${plan.description}`}
                          aria-valuemin={0}
                          aria-valuemax={plan.installmentCount}
                          aria-valuenow={paidCount}
                        >
                          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      {next && !cancelled && (
                        <div className={`mt-4 flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between ${
                          overdue ? "bg-red-50" : "bg-gray-50"
                        }`}>
                          <div className="flex items-start gap-3">
                            <CircleDollarSign className={`mt-0.5 h-5 w-5 shrink-0 ${overdue ? "text-red-600" : "text-emerald-600"}`} />
                            <div>
                              <p className="font-medium text-gray-800">Parcela {next.number} de {plan.installmentCount}</p>
                              <p className={`text-sm ${overdue ? "text-red-700" : "text-gray-500"}`}>
                                Vencimento: {formatDate(next.dueDate)}{overdue ? " · em atraso" : ""}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => payNextInstallment(plan.id)}
                            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700"
                          >
                            <Check className="h-4 w-4" />
                            Registrar pagamento
                          </button>
                        </div>
                      )}

                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-emerald-700 hover:text-emerald-800">
                          Ver histórico das parcelas
                        </summary>
                        <ol className="mt-3 max-h-64 divide-y divide-gray-100 overflow-y-auto rounded-lg border border-gray-100 px-4">
                          {plan.installments.map((installment) => (
                            <li key={installment.number} className="flex items-center justify-between gap-4 py-3 text-sm">
                              <span className="text-gray-700">
                                Parcela {installment.number} · {formatDate(installment.dueDate)}
                              </span>
                              <span className={installment.paidAt ? "font-medium text-emerald-700" : "text-gray-500"}>
                                {installment.paidAt
                                  ? `Paga em ${formatDate(installment.paidAt)}`
                                  : cancelled
                                    ? "Não realizada"
                                    : "Pendente"}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </details>

                      {!cancelled && !completed && (
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Encerrar "${plan.description}"? As parcelas pagas permanecerão no histórico e as futuras deixarão de ser acompanhadas.`)) {
                                cancelPlan(plan.id);
                              }
                            }}
                            className="text-sm font-medium text-gray-500 underline-offset-2 hover:text-red-600 hover:underline"
                          >
                            Encerrar acompanhamento
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
              <h2 className="text-xl font-bold">Nova Transação</h2>
              <p className="text-emerald-100 text-sm mt-1">Registre sua receita ou despesa</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, type: "expense", category: "" }))}
                  className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${
                    formData.type === "expense"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, type: "income", category: "" }))}
                  className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${
                    formData.type === "income"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Receita
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Descrição</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ex: Supermercado, Salário..."
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Valor (R$)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  step="0.01"
                  min="0.01"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Data</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPlanForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
              <h2 className="text-xl font-bold">Nova despesa parcelada</h2>
              <p className="mt-1 text-sm text-emerald-100">Cadastre as parcelas para acompanhar os próximos vencimentos.</p>
            </div>
            <form onSubmit={handlePlanSubmit} className="flex flex-col gap-5 p-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="plan-description" className="text-sm font-medium text-gray-700">Nome da conta ou financiamento</label>
                <input
                  id="plan-description"
                  name="description"
                  type="text"
                  value={planForm.description}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex.: Financiamento do carro"
                  maxLength={80}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="plan-type" className="text-sm font-medium text-gray-700">Tipo de despesa</label>
                <select
                  id="plan-type"
                  value={planForm.type}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="installment">Conta parcelada</option>
                  <option value="financing">Financiamento</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="plan-amount" className="text-sm font-medium text-gray-700">Valor de cada parcela (R$)</label>
                  <input
                    id="plan-amount"
                    type="number"
                    min="0.01"
                    max="999999999"
                    step="0.01"
                    value={planForm.amount}
                    onChange={(e) => setPlanForm((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0,00"
                    className="rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="plan-count" className="text-sm font-medium text-gray-700">Quantidade de parcelas</label>
                  <input
                    id="plan-count"
                    type="number"
                    min="1"
                    max="600"
                    step="1"
                    value={planForm.installmentCount}
                    onChange={(e) => setPlanForm((prev) => ({ ...prev, installmentCount: e.target.value }))}
                    placeholder="Ex.: 12"
                    className="rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="plan-category" className="text-sm font-medium text-gray-700">Categoria</label>
                <select
                  id="plan-category"
                  value={planForm.category}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {CATEGORIES_EXPENSE.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="plan-first-due-date" className="text-sm font-medium text-gray-700">Vencimento da primeira parcela</label>
                <input
                  id="plan-first-due-date"
                  type="date"
                  value={planForm.firstDueDate}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, firstDueDate: e.target.value }))}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {Number(planForm.amount) > 0 && Number(planForm.installmentCount) > 0 && (
                <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                  Total previsto: <strong>{formatCurrency(Number(planForm.amount) * Number(planForm.installmentCount))}</strong>
                  {" "}em {Number(planForm.installmentCount)} parcela(s).
                </p>
              )}
              <p className="text-xs text-gray-500">
                As parcelas futuras não alteram seu saldo. Cada uma vira despesa no dia em que você registrar o pagamento.
              </p>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPlanForm(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-emerald-600 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  Salvar parcelamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
