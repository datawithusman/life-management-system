import { Request, Response } from 'express';
import { StudySession, StudyGoal } from '../models/StudyTracker';
import { Expense } from '../models/Expense';
import { Workout, HealthMetric } from '../models/Health';
import { IslamicPractice, QuranProgress } from '../models/Islamic';
import { Course, IncomeSource } from '../models/Business';
import Task from '../models/Task';
import Goal from '../models/Goal';
import Connection from '../models/Network';
import { LinkedInPost, NetworkingEvent, ProfessionalGoal } from '../models/Professional';

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Study Progress
    const todayStudySessions = await StudySession.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
    });
    const todayStudyHours = todayStudySessions.reduce((sum, s) => sum + s.hoursSpent, 0);
    const studyGoals = await StudyGoal.find({ userId });
    const studyProgress = studyGoals.map((goal) => ({
      subject: goal.subject,
      completionPercentage: (goal.completedHours / goal.targetHours) * 100,
      priority: goal.priority,
    }));

    // Expenses Today
    const todayExpenses = await Expense.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
      type: 'expense',
    });
    const todayExpenseAmount = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Tasks Due Today
    const todayTasks = await Task.find({
      userId,
      dueDate: { $gte: today, $lt: tomorrow },
      completed: false,
    })
      .sort({ priority: -1 })
      .limit(5);

    const todayTasksCompleted = await Task.countDocuments({
      userId,
      dueDate: { $gte: today, $lt: tomorrow },
      completed: true,
    });

    // Upcoming Events
    const upcomingEvents = await NetworkingEvent.find({
      userId,
      date: { $gte: today },
      attended: false,
    })
      .sort({ date: 1 })
      .limit(5);

    // Health Metrics (Latest)
    const latestWorkout = await Workout.findOne({ userId }).sort({ date: -1 });
    const latestHealthMetric = await HealthMetric.findOne({ userId }).sort({ date: -1 });

    // Islamic Practice (Today)
    const todayIslamicPractices = await IslamicPractice.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
    });

    // Quran Progress
    const currentQuranSurah = await QuranProgress.findOne({
      userId,
      completedDate: null,
    });

    // Business Progress
    const activeCourses = await Course.find({ userId, status: 'active' });
    const incomeThisMonth = await IncomeSource.find({ userId });

    // Long-term Goals (Top 3)
    const longTermGoals = await Goal.find({ userId, status: 'in_progress' })
      .sort({ targetDate: 1 })
      .limit(3);

    // Professional Goals
    const professionalGoals = await ProfessionalGoal.find({ userId }).limit(3);

    // Network Connections Due for Follow-up
    const connectionsNeedingFollowUp = await Connection.find({
      userId,
      nextFollowupDate: { $lte: new Date() },
    })
      .limit(5)
      .sort({ nextFollowupDate: 1 });

    // LinkedIn Posts Pending
    const pendingLinkedInPosts = await LinkedInPost.find({
      userId,
      posted: false,
    }).limit(3);

    // Aggregate monthly income
    const totalMonthlyIncome = incomeThisMonth
      .filter((source) => source.frequency === 'monthly' || source.frequency === 'one-time')
      .reduce((sum, source) => sum + source.amount, 0);

    // Daily Progress Summary
    const totalDailyTasks = todayTasks.length + todayTasksCompleted;
    const taskCompletionRate = totalDailyTasks > 0 ? (todayTasksCompleted / totalDailyTasks) * 100 : 0;

    const dashboardData = {
      timestamp: new Date(),
      user: userId,
      date: today,

      // Today's Quick Overview
      todayOverview: {
        studyHours: parseFloat(todayStudyHours.toFixed(2)),
        expenseAmount: parseFloat(todayExpenseAmount.toFixed(2)),
        tasksCount: todayTasks.length,
        tasksCompleted: todayTasksCompleted,
        taskCompletionRate: parseFloat(taskCompletionRate.toFixed(2)),
        islamicPracticesCount: todayIslamicPractices.length,
      },

      // Study Tracking
      studyTracking: {
        todayHours: parseFloat(todayStudyHours.toFixed(2)),
        sessionCount: todayStudySessions.length,
        goals: studyProgress,
        goalCount: studyGoals.length,
      },

      // Expense Management
      expenses: {
        todayTotal: parseFloat(todayExpenseAmount.toFixed(2)),
        count: todayExpenses.length,
        breakdown: todayExpenses.map((e) => ({
          category: e.category,
          amount: e.amount,
          paymentMethod: e.paymentMethod,
        })),
      },

      // Tasks & Reminders
      tasks: {
        pending: todayTasks.map((t) => ({
          id: t._id,
          title: t.title,
          priority: t.priority,
          dueDate: t.dueDate,
        })),
        completedToday: todayTasksCompleted,
      },

      // Upcoming Events & Networking
      professional: {
        upcomingEvents: upcomingEvents.map((e) => ({
          name: e.eventName,
          date: e.date,
          location: e.location,
        })),
        pendingPosts: pendingLinkedInPosts.length,
        goals: professionalGoals.length,
      },

      // Health & Fitness
      health: {
        latestWorkout: latestWorkout ? { type: latestWorkout.type, duration: latestWorkout.duration } : null,
        latestMetric: latestHealthMetric
          ? { weight: latestHealthMetric.weight, heartRate: latestHealthMetric.heartRate }
          : null,
      },

      // Islamic Development
      islamic: {
        practicesCompleted: todayIslamicPractices.length,
        currentQuranSurah: currentQuranSurah
          ? {
              name: currentQuranSurah.surahName,
              progress: ((currentQuranSurah.versesRead / currentQuranSurah.totalVerses) * 100).toFixed(2),
            }
          : null,
      },

      // Business & Courses
      business: {
        activeCourses: activeCourses.map((c) => ({
          name: c.courseName,
          progress: c.progressPercentage,
          platform: c.platform,
        })),
        courseCount: activeCourses.length,
        monthlyIncome: parseFloat(totalMonthlyIncome.toFixed(2)),
      },

      // Long-term Goals
      goals: {
        inProgress: longTermGoals.map((g) => ({
          title: g.title,
          progress: g.progress,
          targetDate: g.targetDate,
          category: g.category,
        })),
        count: longTermGoals.length,
      },

      // Networking & Connections
      network: {
        connectionsNeedingFollowUp: connectionsNeedingFollowUp.length,
        topConnections: connectionsNeedingFollowUp.slice(0, 3).map((c) => ({
          name: c.name,
          strength: c.connectionStrength,
          nextFollowup: c.nextFollowupDate,
        })),
      },

      // Summary Stats
      summary: {
        productivityScore: parseFloat(
          (((todayTasksCompleted / (totalDailyTasks || 1)) * 100 + todayStudyHours * 10) / 2).toFixed(2)
        ),
        activeCourses: activeCourses.length,
        pendingFollowups: connectionsNeedingFollowUp.length,
        pendingLinkedInPosts: pendingLinkedInPosts.length,
      },
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: (error as any).message });
  }
};

export const getWeeklySummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const studySessions = await StudySession.find({
      userId,
      date: { $gte: weekAgo, $lt: today },
    });

    const expenses = await Expense.find({
      userId,
      type: 'expense',
      date: { $gte: weekAgo, $lt: today },
    });

    const workouts = await Workout.find({
      userId,
      date: { $gte: weekAgo, $lt: today },
    });

    const tasks = await Task.find({
      userId,
      completedDate: { $gte: weekAgo, $lt: today },
      completed: true,
    });

    const totalStudyHours = studySessions.reduce((sum, s) => sum + s.hoursSpent, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalWorkouts = workouts.length;
    const completedTasks = tasks.length;

    res.json({
      period: 'Last 7 days',
      studyHours: parseFloat(totalStudyHours.toFixed(2)),
      expenses: parseFloat(totalExpenses.toFixed(2)),
      workouts: totalWorkouts,
      tasksCompleted: completedTasks,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
