import { Request, Response } from 'express';
import Task from '../models/Task';

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, description, dueDate, priority, category, recurring } = req.body;

    if (!title || !dueDate || !category) {
      return res.status(400).json({ error: 'Title, due date, and category are required' });
    }

    const task = new Task({
      userId,
      title,
      description: description || '',
      dueDate,
      priority: priority || 'medium',
      category,
      recurring: recurring || 'none',
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getTodayTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId,
      dueDate: { $gte: today, $lt: tomorrow },
    }).sort({ priority: -1, dueDate: 1 });

    const completed = tasks.filter((t) => t.completed).length;

    res.json({
      date: today,
      totalTasks: tasks.length,
      completedTasks: completed,
      pendingTasks: tasks.length - completed,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getUpcomingTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { days = 7 } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + Number(days));

    const tasks = await Task.find({
      userId,
      dueDate: { $gte: today, $lte: endDate },
      completed: false,
    }).sort({ dueDate: 1, priority: -1 });

    res.json({
      period: `Next ${days} days`,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { status = 'all', limit = 50, skip = 0 } = req.query;

    let filter: any = { userId };

    if (status === 'completed') {
      filter.completed = true;
    } else if (status === 'pending') {
      filter.completed = false;
    }

    const tasks = await Task.find(filter)
      .sort({ dueDate: 1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Task.countDocuments(filter);

    res.json({
      total,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const completeTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { completed: true, completedDate: new Date() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task marked as completed',
      task,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title, description, dueDate, priority, category } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { title, description, dueDate, priority, category },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getTasksByCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tasks = await Task.find({ userId }).sort({ category: 1 });

    const byCategory = tasks.reduce((acc: any, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {});

    res.json({
      byCategory,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
