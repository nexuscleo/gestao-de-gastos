import { prisma } from "../config/prisma.js";
import { UserService } from "./userService.js";

export const TransactionService = {
  async getTransactions(userId) {
    const filter = userId ? { userId: String(userId) } : {};
    return prisma.transaction.findMany({
      where: filter,
      orderBy: { date: "desc" },
    });
  },

  async createTransaction({ userId, description, amount, type, category, date, installmentId }) {
    if (!description || amount === undefined || !type || !category || !date) {
      const error = new Error("Campos obrigatórios ausentes: description, amount, type, category, date.");
      error.statusCode = 400;
      throw error;
    }

    let finalUserId = userId;
    if (!finalUserId) {
      const defaultUser = await UserService.getOrCreateDefaultUser();
      finalUserId = defaultUser.id;
    }

    return prisma.transaction.create({
      data: {
        userId: finalUserId,
        description: description.trim(),
        amount: Math.abs(Number(amount)),
        type,
        category,
        date,
        installmentId: installmentId || null,
      },
    });
  },

  async deleteTransaction(id) {
    return prisma.transaction.delete({
      where: { id },
    });
  },
};
