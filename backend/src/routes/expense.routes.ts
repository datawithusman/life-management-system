import express from 'express';
import {
  addExpense,
  getTodayExpenses,
  getMonthlyReport,
  getAllExpenses,
  setBudget,
  getBudget,
  deleteExpense,
} from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// Expenses
router.post('/add', addExpense);
router.get('/today', getTodayExpenses);
router.get('/monthly-report', getMonthlyReport);
router.get('/all', getAllExpenses);
router.delete('/:expenseId', deleteExpense);

// Budget
router.post('/budget/set', setBudget);
router.get('/budget', getBudget);

export default router;
