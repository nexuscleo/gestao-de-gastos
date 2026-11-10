import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../config/prisma.js";
import { sendEmail } from "./emailService.js";

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production.");
}

const JWT_SECRET = process.env.JWT_SECRET || "financas_super_secret_jwt_key_2026";
const TOKEN_EXPIRY = "7d";

export const AuthService = {
  // Cadastro de novo usuário com envio de token de confirmação
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      const error = new Error("Nome, email e senha são obrigatórios.");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error("A senha deve ter no mínimo 6 caracteres.");
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (existing && existing.password) {
      const error = new Error("Já existe uma conta cadastrada com este email.");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Gera código numérico de 6 dígitos para confirmação de email
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    let user;
    if (existing) {
      // Se era um usuário pré-existente sem senha
      user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: name.trim(),
          password: hashedPassword,
          emailVerified: false,
          verificationToken,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          password: hashedPassword,
          emailVerified: false,
          verificationToken,
        },
      });
    }

    // Dispara e-mail com o código de confirmação
    await sendEmail({
      to: cleanEmail,
      subject: "FinançasPro - Confirme seu endereço de e-mail",
      text: `Olá ${user.name}, seu código de confirmação de e-mail é: ${verificationToken}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #059669;">Bem-vindo ao FinançasPro!</h2>
          <p>Obrigado por se cadastrar. Utilize o código de 6 dígitos abaixo para confirmar sua conta:</p>
          <div style="font-size: 24px; font-weight: bold; background: #ecfdf5; color: #047857; padding: 12px; border-radius: 8px; width: fit-content; letter-spacing: 4px;">
            ${verificationToken}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">Se você não solicitou este cadastro, ignore este e-mail.</p>
        </div>
      `,
    });

    return {
      message: "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.",
      email: cleanEmail,
      devVerificationCode: process.env.NODE_ENV !== "production" ? verificationToken : undefined,
    };
  },

  // Validação do código de e-mail
  async verifyEmail({ email, code }) {
    if (!email || !code) {
      const error = new Error("Email e código são obrigatórios.");
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      const error = new Error("Usuário não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    if (user.emailVerified) {
      return { message: "E-mail já está confirmado.", alreadyVerified: true };
    }

    if (user.verificationToken !== code.trim()) {
      const error = new Error("Código de verificação incorreto ou expirado.");
      error.statusCode = 400;
      throw error;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    const token = jwt.sign({ userId: updatedUser.id, email: updatedUser.email }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    return {
      message: "E-mail confirmado com sucesso!",
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: true,
      },
    };
  },

  // Login com validação de senha e status de verificação
  async login({ email, password }) {
    if (!email || !password) {
      const error = new Error("Email e senha são obrigatórios.");
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user || !user.password) {
      const error = new Error("Credenciais inválidas.");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Credenciais inválidas.");
      error.statusCode = 401;
      throw error;
    }

    if (!user.emailVerified) {
      const error = new Error("Seu e-mail ainda não foi confirmado. Por favor, confirme o código enviado.");
      error.statusCode = 403;
      error.needsEmailVerification = true;
      error.email = cleanEmail;
      throw error;
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    return {
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    };
  },

  // Solicitar recuperação de senha
  async forgotPassword(email) {
    if (!email) {
      const error = new Error("Informe o e-mail cadastrado.");
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      // Retorna sucesso por segurança para evitar enumeração de emails
      return { message: "Se o email estiver cadastrado, as instruções serão enviadas." };
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    await sendEmail({
      to: cleanEmail,
      subject: "FinançasPro - Recuperação de Senha",
      text: `Olá ${user.name}, seu código para redefinição de senha é: ${resetToken}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #059669;">Recuperação de Senha</h2>
          <p>Você solicitou a redefinição de senha para o FinançasPro. Utilize o código abaixo:</p>
          <div style="font-size: 24px; font-weight: bold; background: #fef2f2; color: #dc2626; padding: 12px; border-radius: 8px; width: fit-content; letter-spacing: 4px;">
            ${resetToken}
          </div>
          <p style="margin-top: 15px; font-size: 13px; color: #6b7280;">Este código expira em 30 minutos.</p>
        </div>
      `,
    });

    return {
      message: "Instruções e código de redefinição enviados para seu e-mail.",
      email: cleanEmail,
      devResetCode: process.env.NODE_ENV !== "production" ? resetToken : undefined,
    };
  },

  // Redefinir senha com o código
  async resetPassword({ email, code, newPassword }) {
    if (!email || !code || !newPassword) {
      const error = new Error("Email, código e nova senha são obrigatórios.");
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error("A nova senha deve ter no mínimo 6 caracteres.");
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user || user.resetPasswordToken !== code.trim()) {
      const error = new Error("Código de recuperação inválido.");
      error.statusCode = 400;
      throw error;
    }

    if (user.resetPasswordExpires && new Date() > user.resetPasswordExpires) {
      const error = new Error("Código de recuperação expirou. Solicite um novo.");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        emailVerified: true, // Se redefiniu por email comprovado, marca como verificado
      },
    });

    return { message: "Senha redefinida com sucesso! Agora você pode fazer login." };
  },
};
