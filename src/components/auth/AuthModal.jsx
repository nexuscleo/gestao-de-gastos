import { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, KeyRound, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";
import { showToast } from "../Toast";

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  // Modos: "login" | "register" | "verify" | "forgot" | "reset"
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  // Estados dos formulários
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({ name, email, password });
      showToast("Cadastro realizado! Enviamos um código para seu e-mail.", "success");
      // Se estiver em desenvolvimento, preenche o código para facilitar
      if (res.devVerificationCode) {
        setVerificationCode(res.devVerificationCode);
      }
      setMode("verify");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.verifyEmail({ email, code: verificationCode });
      localStorage.setItem("financas_auth_token", res.token);
      localStorage.setItem("financas_user", JSON.stringify(res.user));
      showToast("E-mail verificado com sucesso! Bem-vindo.", "success");
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem("financas_auth_token", res.token);
      localStorage.setItem("financas_user", JSON.stringify(res.user));
      showToast(`Bem-vindo de volta, ${res.user.name}!`, "success");
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      if (err.needsEmailVerification) {
        showToast("Confirme o código enviado para seu e-mail para entrar.", "info");
        setMode("verify");
      } else {
        showToast(err.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      showToast(res.message, "info");
      if (res.devResetCode) {
        setResetCode(res.devResetCode);
      }
      setMode("reset");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("A nova senha deve ter no mínimo 6 caracteres.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword({
        email,
        code: resetCode,
        newPassword,
      });
      showToast(res.message, "success");
      setMode("login");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
          <div>
            <h2 className="text-xl font-bold">
              {mode === "login" && "Entrar no FinançasPro"}
              {mode === "register" && "Criar nova conta"}
              {mode === "verify" && "Confirmar seu E-mail"}
              {mode === "forgot" && "Recuperar Senha"}
              {mode === "reset" && "Definir Nova Senha"}
            </h2>
            <p className="mt-0.5 text-xs text-emerald-100">
              {mode === "login" && "Acesse suas receitas, despesas e relatórios"}
              {mode === "register" && "Comece a gerenciar suas finanças agora"}
              {mode === "verify" && `Digite o código enviado para ${email}`}
              {mode === "forgot" && "Informe seu e-mail para receber as instruções"}
              {mode === "reset" && "Insira o código recebido e sua nova senha"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário de Login */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <span>{loading ? "Entrando..." : "Entrar"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-3 text-center text-xs text-gray-500">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-semibold text-emerald-600 hover:underline"
              >
                Cadastre-se gratuitamente
              </button>
            </div>
          </form>
        )}

        {/* Formulário de Cadastro */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Senha (mínimo 6 caracteres)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <span>{loading ? "Criando conta..." : "Criar conta"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-3 text-center text-xs text-gray-500">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-emerald-600 hover:underline"
              >
                Fazer login
              </button>
            </div>
          </form>
        )}

        {/* Formulário de Confirmação de E-mail */}
        {mode === "verify" && (
          <form onSubmit={handleVerifyEmail} className="flex flex-col gap-4 p-6">
            <div className="rounded-lg bg-emerald-50 p-3.5 text-xs text-emerald-800">
              Um código de verificação de 6 dígitos foi gerado e enviado para <strong>{email}</strong>.
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Código de verificação</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-4 py-2.5 tracking-widest text-lg font-bold rounded-lg border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{loading ? "Validando..." : "Confirmar E-mail"}</span>
            </button>

            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-gray-500 hover:underline"
              >
                Voltar ao login
              </button>
              <button
                type="button"
                onClick={handleRegister}
                className="text-emerald-600 hover:underline"
              >
                Reenviar código
              </button>
            </div>
          </form>
        )}

        {/* Formulário de Esqueci Minha Senha */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">E-mail cadastrado</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <span>{loading ? "Enviando..." : "Enviar código de recuperação"}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="mt-2 text-center text-xs text-gray-500 hover:underline"
            >
              Lembrou sua senha? Voltar ao login
            </button>
          </form>
        )}

        {/* Formulário de Redefinição de Senha */}
        {mode === "reset" && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4 p-6">
            <div className="rounded-lg bg-blue-50 p-3.5 text-xs text-blue-800">
              Insira o código de 6 dígitos que você recebeu e crie uma nova senha.
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Código de 6 dígitos</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-4 py-2.5 text-center font-bold tracking-widest rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Nova Senha (mínimo 6 caracteres)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <span>{loading ? "Alterando..." : "Redefinir senha"}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="mt-2 text-center text-xs text-gray-500 hover:underline"
            >
              Cancelar e voltar ao login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
