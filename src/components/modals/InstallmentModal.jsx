import { CATEGORIES_EXPENSE, formatCurrency } from "../../utils/financeUtils";

export function InstallmentModal({ isOpen, onClose, onSubmit, form, setForm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
          <h2 className="text-xl font-bold">Nova despesa parcelada</h2>
          <p className="mt-1 text-sm text-emerald-100">Cadastre as parcelas para acompanhar os próximos vencimentos.</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="plan-description" className="text-sm font-medium text-gray-700">Nome da conta ou financiamento</label>
            <input
              id="plan-description"
              name="description"
              type="text"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
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
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
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
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
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
                value={form.installmentCount}
                onChange={(e) => setForm((prev) => ({ ...prev, installmentCount: e.target.value }))}
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
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
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
              value={form.firstDueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, firstDueDate: e.target.value }))}
              className="rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {Number(form.amount) > 0 && Number(form.installmentCount) > 0 && (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              Total previsto: <strong>{formatCurrency(Number(form.amount) * Number(form.installmentCount))}</strong>
              {" "}em {Number(form.installmentCount)} parcela(s).
            </p>
          )}
          <p className="text-xs text-gray-500">
            As parcelas futuras não alteram seu saldo. Cada uma vira despesa no dia em que você registrar o pagamento.
          </p>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
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
  );
}
