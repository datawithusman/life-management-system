import { Request, Response } from 'express';
import { Expense, Budget } from '../models/Expense';

// Expenses
export const addExpense = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { category, amount, description, type, paymentMethod } = req.body;

    if (!category || !amount) {
      return res.status(400).json({ error: 'Category and amount are required' });
    }

    const expense = new Expense({
      userId,
      category,
      amount,
      description: description || '',
      type: type || 'expense',
      paymentMethod: paymentMethod || 'Cash',
    });

    await expense.save();

    res.status(201).json({
      message: 'Expense added successfully',
      expense,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getTodayExpenses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expenses = await Expense.find({
      userId,
      type: 'expense',
      date: { $gte: today, $lt: tomorrow },
    });

    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({
      date: today,
      totalExpense,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getMonthlyReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const expenses = await Expense.find({
      userId,
      type: 'expense',
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const income = await Expense.find({
      userId,
      type: 'income',
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);

    // Group by category
    const byCategory = expenses.reduce((acc: any, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = 0;
      }
      acc[exp.category] += exp.amount;
      return acc;
    }, {});

    res.json({
      month: startOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalExpense,
      totalIncome,
      netAmount: totalIncome - totalExpense,
      byCategory,
      expenseCount: expenses.length,
      incomeCount: income.length,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { limit = 50, skip = 0 } = req.query;

    const expenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Expense.countDocuments({ userId });

    res.json({
      total,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Budget
export const setBudget = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { month, totalBudget, categories } = req.body;

    if (!month || !totalBudget) {
      return res.status(400).json({ error: 'Month and total budget are required' });
    }

    let budget = await Budget.findOne({ userId, month });

    if (budget) {
      budget.totalBudget = totalBudget;
      budget.categories = categories || [];
      await budget.save();
    } else {
      budget = new Budget({
        userId,
        month,
        totalBudget,
        categories: categories || [],
      });
      await budget.save();
    }

    res.json({
      message: 'Budget set successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getBudget = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const now = new Date();
    const month = new Date(now.getFullYear(), now.getMonth(), 1);

    let budget = await Budget.findOne({ userId, month });

    if (!budget) {
      budget = new Budget({
        userId,
        month,
        totalBudget: 0,
        categories: [],
      });
      await budget.save();
    }

    // Get current month expenses
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const expenses = await Expense.find({
      userId,
      type: 'expense',
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = budget.totalBudget - totalSpent;

    res.json({
      budget: budget.totalBudget,
      spent: totalSpent,
      remaining,
      percentageUsed: (totalSpent / budget.totalBudget) * 100,
      categories: budget.categories,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findByIdAndDelete(expenseId);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
