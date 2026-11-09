import { useState, useEffect, useRef } from "react";
import { BarChart3, ArrowLeftRight, CalendarClock } from "lucide-react";
import { api } from "./services/api";
import { ToastContainer, showToast } from "./components/Toast";
import { Header } from "./components/Header";
import { DashboardTab } from "./components/DashboardTab";
import { TransactionsTab } from "./components/TransactionsTab";
import { InstallmentsTab } from "./components/InstallmentsTab";
import { TransactionModal } from "./components/modals/TransactionModal";
import { InstallmentModal } from "./components/modals/InstallmentModal";
import {
  todayISODate,
  addMonths,
  createId,
  isValidDate,
  CATEGORIES_EXPENSE,
} from "./utils/financeUtils";

function loadLocalTransactions() {
  try {
    const saved = window.localStorage.getItem("finance_transactions");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function loadLocalPlans() {
  try {
    const saved = window.localStorage.getItem("finance_installment_plans");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function FinanceApp() {
  const [transactions, setTransactions] = useState(loadLocalTransactions);
  const [plans, setPlans] = useState(loadLocalPlans);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const paymentLocks = useRef(new Set());

  const [formData, setFormData] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: "",
    date: todayISODate(),
  });

  const [planForm, setPlanForm] = useState({
    description: "",
    type: "installment",
    amount: "",
    installmentCount: "",
    category: "Contas",
    firstDueDate: todayISODate(),
  });

  // Sincronização inicial com o MongoDB Atlas
  const fetchCloudData = async (notify = false) => {
    setIsSyncing(true);
    try {
      const [remoteTxs, remotePlans] = await Promise.all([
        api.getTransactions(),
        api.getInstallmentPlans(),
      ]);

      if (Array.isArray(remoteTxs)) setTransactions(remoteTxs);
      if (Array.isArray(remotePlans)) setPlans(remotePlans);

      setIsCloudConnected(true);
      if (notify) showToast("Dados sincronizados com o MongoDB!", "success");
    } catch {
      setIsCloudConnected(false);
      if (notify) showToast("Servidor offline. Usando dados locais.", "info");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchCloudData();
  }, []);

  // Salva fallback no localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem("finance_transactions", JSON.stringify(transactions));
    } catch (e) {
      console.warn("Erro ao salvar localmente:", e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      window.localStorage.setItem("finance_installment_plans", JSON.stringify(plans));
    } catch (e) {
      console.warn("Erro ao salvar parcelamentos localmente:", e);
    }
  }, [plans]);

  // Cálculos financeiros
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Handlers de Ações
  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.date) return;

    const payload = {
      type: formData.type,
      description: formData.description.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    try {
      if (isCloudConnected) {
        const savedTx = await api.createTransaction(payload);
        setTransactions((prev) => [savedTx, ...prev]);
        showToast("Transação salva na nuvem!", "success");
      } else {
        const localTx = { id: createId(), ...payload };
        setTransactions((prev) => [localTx, ...prev]);
        showToast("Transação salva localmente (offline)", "info");
      }
    } catch {
      const fallbackTx = { id: createId(), ...payload };
      setTransactions((prev) => [fallbackTx, ...prev]);
      showToast("Salvo localmente (erro no servidor)", "info");
    }

    setFormData({
      type: "expense",
      description: "",
      amount: "",
      category: "",
      date: todayISODate(),
    });
    setShowForm(false);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      if (isCloudConnected) {
        await api.deleteTransaction(id);
      }
      showToast("Transação excluída!", "success");
    } catch {
      showToast("Excluída localmente.", "info");
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setPlans((prev) => prev.map((plan) => ({
      ...plan,
      installments: plan.installments.map((inst) =>
        inst.transactionId === id ? { ...inst, paidAt: null, transactionId: null } : inst
      ),
    })));
  };

  const handleSubmitPlan = async (e) => {
    e.preventDefault();
    const amount = Math.round(Number(planForm.amount) * 100) / 100;
    const installmentCount = Number(planForm.installmentCount);

    if (
      !planForm.description.trim() ||
      !Number.isFinite(amount) ||
      amount < 0.01 ||
      installmentCount < 1 ||
      !CATEGORIES_EXPENSE.includes(planForm.category) ||
      !isValidDate(planForm.firstDueDate)
    ) {
      showToast("Preencha todos os campos corretamente.", "error");
      return;
    }

    const installments = Array.from({ length: installmentCount }, (_, index) => ({
      number: index + 1,
      dueDate: addMonths(planForm.firstDueDate, index),
      paidAt: null,
      transactionId: null,
    }));

    const planPayload = {
      description: planForm.description.trim(),
      type: planForm.type,
      amount,
      installmentCount,
      category: planForm.category,
      firstDueDate: planForm.firstDueDate,
      installments,
    };

    try {
      if (isCloudConnected) {
        const savedPlan = await api.createInstallmentPlan(planPayload);
        setPlans((prev) => [savedPlan, ...prev]);
        showToast("Parcelamento registrado na nuvem!", "success");
      } else {
        const localPlan = { id: createId(), cancelled: false, ...planPayload };
        setPlans((prev) => [localPlan, ...prev]);
        showToast("Parcelamento salvo localmente.", "info");
      }
    } catch {
      const fallbackPlan = { id: createId(), cancelled: false, ...planPayload };
      setPlans((prev) => [fallbackPlan, ...prev]);
      showToast("Salvo localmente.", "info");
    }

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

  const handlePayInstallment = async (planId) => {
    if (paymentLocks.current.has(planId)) return;

    const plan = plans.find((item) => item.id === planId);
    const installment = plan?.installments.find((item) => item.paidAt === null);
    if (!plan || !installment || plan.cancelled) return;

    paymentLocks.current.add(planId);
    const paidAt = todayISODate();

    try {
      if (isCloudConnected) {
        const updatedPlan = await api.payInstallment(planId, installment.number, { paidAt, createTransaction: true });
        setPlans((prev) => prev.map((p) => (p.id === planId ? updatedPlan : p)));
        const updatedTxs = await api.getTransactions();
        setTransactions(updatedTxs);
        showToast(`Parcela ${installment.number} paga e debitada!`, "success");
      } else {
        const transactionId = createId();
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
        showToast(`Parcela ${installment.number} paga localmente!`, "info");
      }
    } catch (err) {
      console.warn("Erro ao pagar parcela:", err);
      showToast("Não foi possível registrar o pagamento.", "error");
    } finally {
      paymentLocks.current.delete(planId);
    }
  };

  const handleCancelPlan = async (plan) => {
    if (!window.confirm(`Deseja encerrar "${plan.description}"? As parcelas futuras deixarão de ser cobradas.`)) {
      return;
    }

    try {
      if (isCloudConnected) {
        await api.cancelInstallmentPlan(plan.id);
      }
      showToast("Parcelamento encerrado.", "info");
    } catch {
      showToast("Encerrado localmente.", "info");
    }

    setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, cancelled: true } : p)));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <ToastContainer />

      <Header
        isCloudConnected={isCloudConnected}
        isSyncing={isSyncing}
        onSync={() => fetchCloudData(true)}
        onOpenTransactionModal={() => setShowForm(true)}
      />

      {/* Navegação Responsiva com Tabs */}
      <nav className="bg-white border-b sticky top-0 z-10 shadow-sm overflow-x-auto scrollbar-none">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 min-w-max sm:min-w-0">
          {[
            { id: "dashboard", label: "Painel", icon: BarChart3 },
            { id: "transactions", label: "Transações", icon: ArrowLeftRight },
            { id: "installments", label: "Parcelamentos", icon: CalendarClock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-5 py-3.5 sm:py-4 font-medium text-sm border-b-2 transition-colors shrink-0 ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <DashboardTab
            transactions={transactions}
            balance={balance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionsTab
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === "installments" && (
          <InstallmentsTab
            plans={plans}
            onOpenPlanModal={() => setShowPlanForm(true)}
            onPayInstallment={handlePayInstallment}
            onCancelPlan={handleCancelPlan}
            today={todayISODate()}
          />
        )}
      </main>

      {/* Modais Isolados e Reutilizáveis */}
      <TransactionModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitTransaction}
        form={formData}
        setForm={setFormData}
      />

      <InstallmentModal
        isOpen={showPlanForm}
        onClose={() => setShowPlanForm(false)}
        onSubmit={handleSubmitPlan}
        form={planForm}
        setForm={setPlanForm}
      />
    </div>
  );
}
