import { Request, Response } from 'express';
import { Workout, HealthMetric } from '../models/Health';

// Workouts
export const addWorkout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type, duration, intensity, calories, notes } = req.body;

    if (!type || !duration) {
      return res.status(400).json({ error: 'Workout type and duration are required' });
    }

    const workout = new Workout({
      userId,
      type,
      duration,
      intensity: intensity || 'moderate',
      calories: calories || 0,
      notes: notes || '',
    });

    await workout.save();

    res.status(201).json({
      message: 'Workout added successfully',
      workout,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getTodayWorkouts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const workouts = await Workout.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
    });

    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);

    res.json({
      count: workouts.length,
      totalDuration,
      totalCalories,
      workouts,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getMonthlyWorkoutStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const workouts = await Workout.find({
      userId,
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const averageIntensity = workouts.length > 0 ? workouts.length : 0;

    const byType = workouts.reduce((acc: any, w) => {
      if (!acc[w.type]) {
        acc[w.type] = { count: 0, duration: 0 };
      }
      acc[w.type].count += 1;
      acc[w.type].duration += w.duration;
      return acc;
    }, {});

    res.json({
      month: startOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalWorkouts: workouts.length,
      totalDuration,
      totalCalories,
      averageWorkoutDuration: workouts.length > 0 ? totalDuration / workouts.length : 0,
      byType,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getAllWorkouts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { limit = 50, skip = 0 } = req.query;

    const workouts = await Workout.find({ userId })
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Workout.countDocuments({ userId });

    res.json({
      total,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Health Metrics
export const addHealthMetric = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { weight, height, bloodPressure, heartRate } = req.body;

    if (!weight && !heartRate && !bloodPressure) {
      return res.status(400).json({ error: 'At least one metric is required' });
    }

    const metric = new HealthMetric({
      userId,
      weight,
      height,
      bloodPressure,
      heartRate,
    });

    await metric.save();

    res.status(201).json({
      message: 'Health metric recorded successfully',
      metric,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getLatestMetric = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const metric = await HealthMetric.findOne({ userId }).sort({ date: -1 });

    if (!metric) {
      return res.status(404).json({ error: 'No health metrics found' });
    }

    res.json(metric);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getMetricHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { limit = 30 } = req.query;

    const metrics = await HealthMetric.find({ userId })
      .sort({ date: -1 })
      .limit(Number(limit));

    res.json({
      count: metrics.length,
      metrics,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const deleteWorkout = async (req: Request, res: Response) => {
  try {
    const { workoutId } = req.params;
    const workout = await Workout.findByIdAndDelete(workoutId);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
