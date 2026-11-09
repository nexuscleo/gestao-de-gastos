import { Wallet, PlusCircle, Cloud, CloudOff, RefreshCw, User, LogOut, LogIn } from "lucide-react";

export function Header({
  isCloudConnected,
  isSyncing,
  currentUser,
  onSync,
  onOpenTransactionModal,
  onOpenAuthModal,
  onLogout,
}) {
  return (
    <header className="bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-wrap items-center justify-between gap-3">
        {/* Logo e Status da Conexão */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Wallet className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">FinançasPro</h1>
            <div className="flex items-center gap-1.5 text-xs text-emerald-100">
              {isCloudConnected ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Nuvem Ativa</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-200" />
                  <span>Modo Offline</span>
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

        {/* Área de Usuário e Ações */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-emerald-700/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-emerald-500/30 text-xs sm:text-sm">
              <User className="w-4 h-4 text-emerald-200" />
              <span className="font-medium max-w-[120px] sm:max-w-[160px] truncate">{currentUser.name}</span>
              <button
                type="button"
                onClick={onLogout}
                className="p-1 text-emerald-200 hover:text-white rounded hover:bg-emerald-600/50 transition-colors ml-1"
                title="Sair da conta"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors border border-emerald-500/40"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar / Cadastrar</span>
            </button>
          )}

          <button
            onClick={onOpenTransactionModal}
            className="flex items-center gap-1.5 sm:gap-2 bg-white text-emerald-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-emerald-50 transition-colors shadow"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Nova Transação</span>
          </button>
        </div>
      </div>
    </header>
  );
}
