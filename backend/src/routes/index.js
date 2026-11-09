import { Router } from "express";
import { UserService } from "../services/userService.js";
import { TransactionService } from "../services/transactionService.js";
import { InstallmentService } from "../services/installmentService.js";

const router = Router();

// --- Health ---
router.get("/health", async (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Usuários ---
router.get("/users", async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/users", async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// --- Transações ---
router.get("/transactions", async (req, res, next) => {
  try {
    const transactions = await TransactionService.getTransactions(req.query.userId);
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
});

router.post("/transactions", async (req, res, next) => {
  try {
    const transaction = await TransactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
});

router.delete("/transactions/:id", async (req, res, next) => {
  try {
    await TransactionService.deleteTransaction(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// --- Parcelamentos ---
router.get("/installment-plans", async (req, res, next) => {
  try {
    const plans = await InstallmentService.getPlans(req.query.userId);
    res.status(200).json(plans);
  } catch (err) {
    next(err);
  }
});

router.post("/installment-plans", async (req, res, next) => {
  try {
    const plan = await InstallmentService.createPlan(req.body);
    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
});

router.patch("/installment-plans/:id/pay-installment", async (req, res, next) => {
  try {
    const { installmentNumber, paidAt, createTransaction } = req.body;
    const plan = await InstallmentService.payInstallment(req.params.id, installmentNumber, {
      paidAt,
      createTransaction,
    });
    res.status(200).json(plan);
  } catch (err) {
    next(err);
  }
});

router.patch("/installment-plans/:id/cancel", async (req, res, next) => {
  try {
    const plan = await InstallmentService.cancelPlan(req.params.id);
    res.status(200).json(plan);
  } catch (err) {
    next(err);
  }
});

export default router;
