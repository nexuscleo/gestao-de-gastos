import { prisma } from "../config/prisma.js";
import { UserService } from "./userService.js";

export const InstallmentService = {
  async getPlans(userId) {
    const filter = userId ? { userId: String(userId) } : {};
    return prisma.installmentPlan.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
    });
  },

  async createPlan({ userId, description, type, category, amount, installmentCount, firstDueDate, installments }) {
    if (!description || !amount || !installmentCount || !firstDueDate) {
      const error = new Error("Campos obrigatórios ausentes para o plano de parcelamento.");
      error.statusCode = 400;
      throw error;
    }

    let finalUserId = userId;
    if (!finalUserId) {
      const defaultUser = await UserService.getOrCreateDefaultUser();
      finalUserId = defaultUser.id;
    }

    return prisma.installmentPlan.create({
      data: {
        userId: finalUserId,
        description: description.trim(),
        type: type || "installment",
        category,
        amount: Number(amount),
        installmentCount: Number(installmentCount),
        firstDueDate,
        installments: installments || [],
      },
    });
  },

  async payInstallment(planId, installmentNumber, options = {}) {
    const plan = await prisma.installmentPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      const error = new Error("Plano de parcelamento não encontrado.");
      error.statusCode = 404;
      throw error;
    }

    const payDate = options.paidAt || new Date().toISOString().slice(0, 10);
    let createdTxId = null;

    if (options.createTransaction !== false) {
      const tx = await prisma.transaction.create({
        data: {
          userId: plan.userId,
          description: `${plan.description} (${installmentNumber}/${plan.installmentCount})`,
          amount: plan.amount,
          type: "expense",
          category: plan.category,
          date: payDate,
          installmentId: `${plan.id}-${installmentNumber}`,
        },
      });
      createdTxId = tx.id;
    }

    const updatedInstallments = plan.installments.map((inst) => {
      if (inst.number === Number(installmentNumber)) {
        return { ...inst, paidAt: payDate, transactionId: createdTxId };
      }
      return inst;
    });

    return prisma.installmentPlan.update({
      where: { id: planId },
      data: { installments: updatedInstallments },
    });
  },

  async cancelPlan(planId) {
    return prisma.installmentPlan.update({
      where: { id: planId },
      data: { cancelled: true },
    });
  },
};
