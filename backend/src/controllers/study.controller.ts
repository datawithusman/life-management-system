import { Request, Response } from 'express';
import { StudySession, StudyGoal } from '../models/StudyTracker';

// Study Sessions
export const addStudySession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { subject, topic, hoursSpent, notes } = req.body;

    if (!subject || !topic || !hoursSpent) {
      return res.status(400).json({ error: 'Subject, topic, and hours are required' });
    }

    const session = new StudySession({
      userId,
      subject,
      topic,
      hoursSpent,
      notes: notes || '',
    });

    await session.save();

    // Update study goal
    const goal = await StudyGoal.findOne({ userId, subject });
    if (goal) {
      goal.completedHours += hoursSpent;
      await goal.save();
    }

    res.status(201).json({
      message: 'Study session added successfully',
      session,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getStudySessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { subject, date } = req.query;

    let filter: any = { userId };

    if (subject) {
      filter.subject = subject;
    }

    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const sessions = await StudySession.find(filter).sort({ date: -1 });

    res.json({
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getTodayStudyHours = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessions = await StudySession.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
    });

    const totalHours = sessions.reduce((sum, session) => sum + session.hoursSpent, 0);

    res.json({
      totalHours,
      sessionCount: sessions.length,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Study Goals
export const createStudyGoal = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { subject, targetHours, priority, deadline, description } = req.body;

    if (!subject || !targetHours) {
      return res.status(400).json({ error: 'Subject and target hours are required' });
    }

    const goal = new StudyGoal({
      userId,
      subject,
      targetHours,
      priority: priority || 'medium',
      deadline,
      description: description || '',
    });

    await goal.save();

    res.status(201).json({
      message: 'Study goal created successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getStudyGoals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const goals = await StudyGoal.find({ userId }).sort({ priority: -1 });

    const goalsWithProgress = goals.map((goal) => ({
      ...goal.toObject(),
      progressPercentage: (goal.completedHours / goal.targetHours) * 100,
    }));

    res.json({
      count: goals.length,
      goals: goalsWithProgress,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const updateStudyGoal = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const { completedHours, priority, description } = req.body;

    const goal = await StudyGoal.findByIdAndUpdate(
      goalId,
      { completedHours, priority, description },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({
      message: 'Study goal updated successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const deleteStudySession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await StudySession.findByIdAndDelete(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Study session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
