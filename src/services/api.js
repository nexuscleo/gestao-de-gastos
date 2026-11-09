const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("financas_auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const api = {
  // --- AUTENTICAÇÃO ---
  async register(data) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro no cadastro");
    return json;
  },

  async verifyEmail(data) {
    const res = await fetch(`${API_URL}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro na validação do e-mail");
    return json;
  },

  async login(data) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      const err = new Error(json.error || "Erro ao efetuar login");
      err.needsEmailVerification = json.needsEmailVerification;
      err.email = json.email;
      throw err;
    }
    return json;
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro ao solicitar recuperação");
    return json;
  },

  async resetPassword(data) {
    const res = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro ao redefinir senha");
    return json;
  },

  // --- TRANSAÇÕES ---
  async getTransactions(userId) {
    const url = userId ? `${API_URL}/api/transactions?userId=${userId}` : `${API_URL}/api/transactions`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Erro ao carregar transações");
    return res.json();
  },

  async createTransaction(transaction) {
    const res = await fetch(`${API_URL}/api/transactions`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(transaction),
    });
    if (!res.ok) throw new Error("Erro ao salvar transação");
    return res.json();
  },

  async deleteTransaction(id) {
    const res = await fetch(`${API_URL}/api/transactions/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao excluir transação");
    return true;
  },

  // --- PARCELAMENTOS ---
  async getInstallmentPlans(userId) {
    const url = userId ? `${API_URL}/api/installment-plans?userId=${userId}` : `${API_URL}/api/installment-plans`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Erro ao carregar parcelamentos");
    return res.json();
  },

  async createInstallmentPlan(plan) {
    const res = await fetch(`${API_URL}/api/installment-plans`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(plan),
    });
    if (!res.ok) throw new Error("Erro ao criar parcelamento");
    return res.json();
  },

  async payInstallment(planId, installmentNumber, options = {}) {
    const res = await fetch(`${API_URL}/api/installment-plans/${planId}/pay-installment`, {
      method: "PATCH",
      headers: getAuthHeaders(),
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
    const res = await fetch(`${API_URL}/api/installment-plans/${planId}/cancel`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao cancelar parcelamento");
    return res.json();
  },
};
