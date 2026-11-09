import { prisma } from "../config/prisma.js";

export const UserService = {
  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async createUser({ name, email }) {
    if (!name || !email) {
      const error = new Error("Nome e email são obrigatórios.");
      error.statusCode = 400;
      throw error;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return existing; // Idempotente para simplificar fluxo
    }

    return prisma.user.create({
      data: { name: name.trim(), email: email.trim().toLowerCase() },
    });
  },

  async getOrCreateDefaultUser() {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Usuário Principal",
          email: "usuario@gestaogastos.com",
        },
      });
    }
    return user;
  },
};
