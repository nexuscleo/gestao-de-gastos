const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = {
  // Transações
  async getTransactions(userId) {
    const url = userId ? `${API_URL}/transactions?userId=${userId}` : `${API_URL}/transactions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao carregar transações");
    return res.json();
  },

  async createTransaction(transaction) {
    const res = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    if (!res.ok) throw new Error("Erro ao salvar transação");
    return res.json();
  },

  async deleteTransaction(id) {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao excluir transação");
    return true;
  },

  // Parcelamentos
  async getInstallmentPlans(userId) {
    const url = userId ? `${API_URL}/installment-plans?userId=${userId}` : `${API_URL}/installment-plans`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao carregar parcelamentos");
    return res.json();
  },

  async createInstallmentPlan(plan) {
    const res = await fetch(`${API_URL}/installment-plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plan),
    });
    if (!res.ok) throw new Error("Erro ao criar parcelamento");
    return res.json();
  },

  async payInstallment(planId, installmentNumber, options = {}) {
    const res = await fetch(`${API_URL}/installment-plans/${planId}/pay-installment`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        installmentNumber,
        paidAt: options.paidAt,
        createTransaction: options.createTransaction ?? true,
      }),
    });
    if (!res.ok) throw new Error("Erro ao registrar pagamento");
    return res.json();
  },

  async cancelInstallmentPlan(planId) {
    const res = await fetch(`${API_URL}/installment-plans/${planId}/cancel`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Erro ao cancelar parcelamento");
    return res.json();
  },

  // Usuários
  async getUsers() {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error("Erro ao buscar usuários");
    return res.json();
  },

  async createUser(userData) {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar usuário");
    return res.json();
  },
};
