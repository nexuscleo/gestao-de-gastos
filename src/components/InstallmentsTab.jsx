import { PlusCircle, CalendarClock, CircleDollarSign, Check } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/financeUtils";

export function InstallmentsTab({ plans, onOpenPlanModal, onPayInstallment, onCancelPlan, today }) {
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
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Parcelamentos e financiamentos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Acompanhe os vencimentos e registre cada parcela quando pagar.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenPlanModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <PlusCircle className="h-5 w-5" />
          Novo parcelamento
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            onClick={onOpenPlanModal}
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
                      onClick={() => onPayInstallment(plan.id)}
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
                      onClick={() => onCancelPlan(plan)}
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
  );
}
