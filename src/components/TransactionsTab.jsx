import { useState } from "react";
import { ArrowLeftRight, TrendingUp, TrendingDown, Trash2, Search, Download, Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/financeUtils";
import { showToast } from "./Toast";

export function TransactionsTab({ transactions, onDeleteTransaction }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterMonth, setFilterMonth] = useState(""); // YYYY-MM

  // Extrai lista única de meses disponíveis para o filtro
  const availableMonths = Array.from(
    new Set(transactions.map((t) => t.date.substring(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesMonth = !filterMonth || t.date.startsWith(filterMonth);
    return matchesSearch && matchesType && matchesMonth;
  });

  // Função para exportar transações para CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      showToast("Nenhuma transação para exportar.", "info");
      return;
    }

    const headers = ["Descrição", "Tipo", "Categoria", "Valor (R$)", "Data"];
    const rows = filteredTransactions.map((t) => [
      `"${t.description.replace(/"/g, '""')}"`,
      t.type === "income" ? "Receita" : "Despesa",
      `"${t.category}"`,
      t.amount.toFixed(2),
      t.date,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transacoes_${filterMonth || "todas"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Relatório CSV baixado com sucesso!", "success");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Cabeçalho com Filtros, Busca e Exportação */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Todas as Transações</h3>
            <span className="text-xs text-gray-500">
              Exibindo {filteredTransactions.length} de {transactions.length} registros
            </span>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 self-start sm:self-auto px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            title="Exportar registros filtrados para CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* Linha de Filtros */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Campo de Busca */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descrição ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filtro de Mês */}
          {availableMonths.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="py-1.5 px-2.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Todos os meses</option>
                {availableMonths.map((m) => {
                  const [year, month] = m.split("-");
                  return (
                    <option key={m} value={m}>
                      {month}/{year}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Filtro de Tipo */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 rounded-md transition-all ${filterType === "all" ? "bg-white shadow-sm text-gray-800 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-2.5 py-1 rounded-md transition-all ${filterType === "income" ? "bg-white shadow-sm text-emerald-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`px-2.5 py-1 rounded-md transition-all ${filterType === "expense" ? "bg-white shadow-sm text-red-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
            >
              Despesas
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Registros */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma transação encontrada com os filtros atuais.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredTransactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  t.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                }`}>
                  {t.type === "income" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm sm:text-base">{t.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t.category}</span>
                    <span className="text-xs text-gray-400">{formatDate(t.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <p className={`font-bold text-base sm:text-lg ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </p>
                <button
                  onClick={() => onDeleteTransaction(t.id)}
                  className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
  );
}
