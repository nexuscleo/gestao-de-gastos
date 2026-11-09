import { Wallet, PlusCircle, Cloud, CloudOff, RefreshCw } from "lucide-react";

export function Header({ isCloudConnected, isSyncing, onSync, onOpenTransactionModal }) {
  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Wallet className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">FinançasPro</h1>
            <div className="flex items-center gap-1.5 text-xs text-emerald-100">
              {isCloudConnected ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Nuvem Ativa (MongoDB)</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-200" />
                  <span>Modo Offline (Local)</span>
                </>
              )}
              <button
                type="button"
                onClick={onSync}
                disabled={isSyncing}
                className="ml-1 p-0.5 hover:text-white transition-opacity"
                title="Sincronizar dados"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onOpenTransactionModal}
          className="flex items-center gap-1.5 sm:gap-2 bg-white text-emerald-700 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold hover:bg-emerald-50 transition-colors shadow"
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Nova Transação</span>
        </button>
      </div>
    </header>
  );
}
