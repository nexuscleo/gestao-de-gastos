import { Router } from "express";
import { AuthService } from "../services/authService.js";
import { UserService } from "../services/userService.js";
import { TransactionService } from "../services/transactionService.js";
import { InstallmentService } from "../services/installmentService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Aplica middleware de autenticação opcional/extração de token em todas as rotas
router.use(authMiddleware);

// --- Health ---
router.get("/health", async (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- AUTENTICAÇÃO ---
router.post("/auth/register", async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/auth/verify-email", async (req, res, next) => {
  try {
    const result = await AuthService.verifyEmail(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/auth/forgot-password", async (req, res, next) => {
  try {
    const result = await AuthService.forgotPassword(req.body.email);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/auth/reset-password", async (req, res, next) => {
  try {
    const result = await AuthService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
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

// --- Transações ---
router.get("/transactions", async (req, res, next) => {
  try {
    const userId = req.userId || req.query.userId;
    const transactions = await TransactionService.getTransactions(userId);
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
});

router.post("/transactions", async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.userId || req.body.userId };
    const transaction = await TransactionService.createTransaction(payload);
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
    const userId = req.userId || req.query.userId;
    const plans = await InstallmentService.getPlans(userId);
    res.status(200).json(plans);
  } catch (err) {
    next(err);
  }
});

router.post("/installment-plans", async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.userId || req.body.userId };
    const plan = await InstallmentService.createPlan(payload);
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
