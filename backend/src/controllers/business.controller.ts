import { Request, Response } from 'express';
import { Course, ClientFollowup, IncomeSource } from '../models/Business';

// Courses
export const addCourse = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { courseName, platform, totalModules, estimatedEndDate } = req.body;

    if (!courseName) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    const course = new Course({
      userId,
      courseName,
      platform: platform || 'Other',
      totalModules: totalModules || 0,
      estimatedEndDate,
    });

    await course.save();

    res.status(201).json({
      message: 'Course added successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getActiveCourses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const courses = await Course.find({ userId, status: 'active' }).sort({ startDate: -1 });

    res.json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const updateCourseProgress = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { progressPercentage, completedModules, status } = req.body;

    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        progressPercentage: progressPercentage || 0,
        completedModules: completedModules || 0,
        status: status || 'active',
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      message: 'Course progress updated',
      course,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const courses = await Course.find({ userId }).sort({ startDate: -1 });

    const active = courses.filter((c) => c.status === 'active').length;
    const completed = courses.filter((c) => c.status === 'completed').length;

    res.json({
      totalCourses: courses.length,
      activeCourses: active,
      completedCourses: completed,
      courses,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Client Followups
export const addClientFollowup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { clientName, projectName, nextFollowupDate, notes } = req.body;

    if (!clientName || !nextFollowupDate) {
      return res.status(400).json({ error: 'Client name and followup date are required' });
    }

    const followup = new ClientFollowup({
      userId,
      clientName,
      projectName: projectName || '',
      nextFollowupDate,
      notes: notes || '',
    });

    await followup.save();

    res.status(201).json({
      message: 'Client followup added successfully',
      followup,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getPendingFollowups = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const followups = await ClientFollowup.find({
      userId,
      status: 'active',
      nextFollowupDate: { $lte: new Date() },
    }).sort({ nextFollowupDate: 1 });

    res.json({
      pendingCount: followups.length,
      followups,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getAllClientFollowups = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const followups = await ClientFollowup.find({ userId }).sort({ nextFollowupDate: 1 });

    const active = followups.filter((f) => f.status === 'active').length;

    res.json({
      total: followups.length,
      activeFollowups: active,
      followups,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const updateFollowupStatus = async (req: Request, res: Response) => {
  try {
    const { followupId } = req.params;
    const { status, notes } = req.body;

    const followup = await ClientFollowup.findByIdAndUpdate(
      followupId,
      { status, notes, lastContact: new Date() },
      { new: true }
    );

    if (!followup) {
      return res.status(404).json({ error: 'Followup not found' });
    }

    res.json({
      message: 'Followup updated successfully',
      followup,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Income Sources
export const addIncomeSource = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { sourceName, amount, frequency } = req.body;

    if (!sourceName || !amount) {
      return res.status(400).json({ error: 'Source name and amount are required' });
    }

    const source = new IncomeSource({
      userId,
      sourceName,
      amount,
      frequency: frequency || 'monthly',
      lastReceived: new Date(),
    });

    await source.save();

    res.status(201).json({
      message: 'Income source added successfully',
      source,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getIncomeSources = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const sources = await IncomeSource.find({ userId }).sort({ createdAt: -1 });

    const monthlyIncome = sources
      .filter((s) => s.frequency === 'monthly')
      .reduce((sum, s) => sum + s.amount, 0);

    const totalSources = sources.length;

    res.json({
      totalSources,
      monthlyIncome,
      sources,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const updateIncomeSource = async (req: Request, res: Response) => {
  try {
    const { sourceId } = req.params;
    const { amount, frequency } = req.body;

    const source = await IncomeSource.findByIdAndUpdate(
      sourceId,
      { amount, frequency },
      { new: true }
    );

    if (!source) {
      return res.status(404).json({ error: 'Income source not found' });
    }

    res.json({
      message: 'Income source updated',
      source,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
