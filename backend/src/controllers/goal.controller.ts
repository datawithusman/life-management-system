import { Request, Response } from 'express';
import Goal from '../models/Goal';

export const createGoal = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, description, category, targetDate, milestones } = req.body;

    if (!title || !category || !targetDate) {
      return res.status(400).json({ error: 'Title, category, and target date are required' });
    }

    const goal = new Goal({
      userId,
      title,
      description: description || '',
      category,
      targetDate,
      milestones: milestones || [],
    });

    await goal.save();

    res.status(201).json({
      message: 'Goal created successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getAllGoals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const goals = await Goal.find({ userId }).sort({ targetDate: 1 });

    const inProgress = goals.filter((g) => g.status === 'in_progress').length;
    const completed = goals.filter((g) => g.status === 'completed').length;

    res.json({
      totalGoals: goals.length,
      inProgressGoals: inProgress,
      completedGoals: completed,
      goals,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getGoalsByCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { category } = req.params;

    const goals = await Goal.find({ userId, category }).sort({ targetDate: 1 });

    res.json({
      category,
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getGoalDetails = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const completedMilestones = goal.milestones.filter((m) => m.completed).length;

    res.json({
      goal,
      completedMilestones,
      totalMilestones: goal.milestones.length,
      milestoneProgress: (completedMilestones / goal.milestones.length) * 100 || 0,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const updateGoalProgress = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const { progress, status } = req.body;

    const goal = await Goal.findByIdAndUpdate(
      goalId,
      { progress, status },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({
      message: 'Goal progress updated',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const completeMilestone = async (req: Request, res: Response) => {
  try {
    const { goalId, milestoneIndex } = req.params;

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const milestone = goal.milestones[Number(milestoneIndex)];
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    milestone.completed = true;
    milestone.completedDate = new Date();
    await goal.save();

    res.json({
      message: 'Milestone completed',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const addMilestone = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const { title, targetDate } = req.body;

    if (!title || !targetDate) {
      return res.status(400).json({ error: 'Title and target date are required' });
    }

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goal.milestones.push({
      title,
      targetDate,
      completed: false,
    });

    await goal.save();

    res.json({
      message: 'Milestone added',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const goal = await Goal.findByIdAndDelete(goalId);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getInProgressGoals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const goals = await Goal.find({ userId, status: 'in_progress' }).sort({ targetDate: 1 });

    res.json({
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
