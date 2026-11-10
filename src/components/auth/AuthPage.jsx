import { useState } from "react";
import { Wallet, Mail, Lock, User, ArrowRight, KeyRound, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { api } from "../../services/api";
import { showToast } from "../Toast";

export function AuthPage({ onAuthSuccess }) {
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
      showToast(`Bem-vindo, ${res.user.name}!`, "success");
      onAuthSuccess(res.user);
    } catch (err) {
      if (err.needsEmailVerification) {
        showToast("Confirme seu e-mail para acessar.", "info");
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-gray-50 to-teal-50 flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <Wallet className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">FinançasPro</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Controle Financeiro Pessoal</p>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            {mode === "login" && "Acesse sua conta"}
            {mode === "register" && "Crie sua conta"}
            {mode === "verify" && "Confirme seu e-mail"}
            {mode === "forgot" && "Recuperação de senha"}
            {mode === "reset" && "Defina a nova senha"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100">
            {mode === "login" && "Entre para gerenciar suas receitas e despesas"}
            {mode === "register" && "Leva menos de 1 minuto para começar"}
            {mode === "verify" && `Insira o código enviado para ${email}`}
            {mode === "forgot" && "Enviaremos um código de 6 dígitos para seu e-mail"}
            {mode === "reset" && "Digite o código recebido e sua nova senha"}
          </p>
        </div>

        {/* 1. LOGIN */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Senha</label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Esqueceu?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Entrando..." : "Acessar Plataforma"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              Ainda não tem conta?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-bold text-emerald-600 hover:underline"
              >
                Cadastre-se gratuitamente
              </button>
            </div>
          </form>
        )}

        {/* 2. CADASTRO */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Senha (mínimo 6 caracteres)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Criando Conta..." : "Cadastrar e Continuar"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-bold text-emerald-600 hover:underline"
              >
                Fazer login
              </button>
            </div>
          </form>
        )}

        {/* 3. CONFIRMAÇÃO DE E-MAIL */}
        {mode === "verify" && (
          <form onSubmit={handleVerifyEmail} className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-xs text-emerald-800 leading-relaxed">
              Enviamos um código numérico de <strong>6 dígitos</strong> para o endereço <strong>{email}</strong>.
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Código de Confirmação</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full py-3 tracking-[0.4em] text-2xl font-black rounded-xl border-2 border-emerald-500/40 text-center focus:outline-none focus:border-emerald-600 bg-emerald-50/20 text-emerald-950"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{loading ? "Verificando..." : "Confirmar e Acessar"}</span>
            </button>

            <div className="mt-4 flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="hover:text-gray-700 hover:underline"
              >
                Voltar ao login
              </button>
              <button
                type="button"
                onClick={handleRegister}
                className="font-semibold text-emerald-600 hover:underline"
              >
                Reenviar código
              </button>
            </div>
          </form>
        )}

        {/* 4. ESQUECI MINHA SENHA */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">E-mail Cadastrado</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Enviando..." : "Enviar Código de Recuperação"}</span>
            </button>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              Lembrou a senha?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-bold text-emerald-600 hover:underline"
              >
                Voltar ao login
              </button>
            </div>
          </form>
        )}

        {/* 5. REDEFINIR SENHA */}
        {mode === "reset" && (
          <form onSubmit={handleResetPassword} className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-xs text-blue-800 leading-relaxed">
              Digite o código de 6 dígitos enviado para <strong>{email}</strong> e escolha uma nova senha.
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Código de 6 dígitos</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Nova Senha (mínimo 6 caracteres)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Salvando..." : "Redefinir e Entrar"}</span>
            </button>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="hover:underline text-gray-500"
              >
                Cancelar e voltar ao login
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security Footer Badge */}
      <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Ambiente seguro protegido por criptografia de ponta a ponta</span>
      </div>
    </div>
  );
}
