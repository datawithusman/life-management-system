import { Request, Response } from 'express';
import { IslamicPractice, QuranProgress } from '../models/Islamic';

// Islamic Practices
export const addPractice = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { practiceType, completed, notes } = req.body;

    if (!practiceType) {
      return res.status(400).json({ error: 'Practice type is required' });
    }

    const practice = new IslamicPractice({
      userId,
      practiceType,
      completed: completed !== undefined ? completed : true,
      notes: notes || '',
    });

    await practice.save();

    res.status(201).json({
      message: 'Islamic practice recorded successfully',
      practice,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getTodayPractices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const practices = await IslamicPractice.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
    });

    const completed = practices.filter((p) => p.completed).length;

    res.json({
      date: today,
      totalPractices: practices.length,
      completedPractices: completed,
      practices,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getWeeklyPractices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const practices = await IslamicPractice.find({
      userId,
      date: { $gte: weekAgo, $lte: today },
    }).sort({ date: -1 });

    const byPractice = practices.reduce((acc: any, p) => {
      if (!acc[p.practiceType]) {
        acc[p.practiceType] = { total: 0, completed: 0 };
      }
      acc[p.practiceType].total += 1;
      if (p.completed) acc[p.practiceType].completed += 1;
      return acc;
    }, {});

    res.json({
      week: `${weekAgo.toDateString()} to ${today.toDateString()}`,
      totalPractices: practices.length,
      byPractice,
      practices,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getAllPractices = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { limit = 50, skip = 0 } = req.query;

    const practices = await IslamicPractice.find({ userId })
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await IslamicPractice.countDocuments({ userId });

    res.json({
      total,
      count: practices.length,
      practices,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Quran Progress
export const addQuranProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { surahName, versesRead, totalVerses } = req.body;

    if (!surahName || !versesRead || !totalVerses) {
      return res.status(400).json({ error: 'Surah name, verses read, and total verses are required' });
    }

    const progress = new QuranProgress({
      userId,
      surahName,
      versesRead,
      totalVerses,
      completedDate: versesRead >= totalVerses ? new Date() : undefined,
    });

    await progress.save();

    res.status(201).json({
      message: 'Quran progress recorded successfully',
      progress,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getQuranProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const progress = await QuranProgress.find({ userId }).sort({ createdAt: -1 });

    const completed = progress.filter((p) => p.completedDate).length;
    const totalVerses = progress.reduce((sum, p) => sum + p.versesRead, 0);

    res.json({
      totalSurahsRead: progress.length,
      completedSurahs: completed,
      totalVersesRead: totalVerses,
      progress,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const updateQuranProgress = async (req: Request, res: Response) => {
  try {
    const { progressId } = req.params;
    const { versesRead } = req.body;

    const progress = await QuranProgress.findById(progressId);
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    progress.versesRead = versesRead;
    if (versesRead >= progress.totalVerses) {
      progress.completedDate = new Date();
    }

    await progress.save();

    res.json({
      message: 'Quran progress updated successfully',
      progress,
    });
  } catch (error) {
    res.status(500).json({ error:
