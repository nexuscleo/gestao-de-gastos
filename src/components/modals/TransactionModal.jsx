import { CATEGORIES_INCOME, CATEGORIES_EXPENSE } from "../../utils/financeUtils";

export function TransactionModal({ isOpen, onClose, onSubmit, form, setForm }) {
  if (!isOpen) return null;

  const categories = form.type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "type") {
        updated.category = "";
      }
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold">Nova Transação</h2>
          <p className="text-emerald-100 text-sm mt-1">Registre sua receita ou despesa</p>
        </div>
        <form onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: "expense", category: "" }))}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${
                form.type === "expense"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: "income", category: "" }))}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${
                form.type === "income"
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
              value={form.description}
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
              value={form.amount}
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
              value={form.category}
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
              value={form.date}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
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
  );
}
