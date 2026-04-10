import { Request, Response } from 'express';
import { LinkedInPost, NetworkingEvent, ProfessionalGoal } from '../models/Professional';

// LinkedIn Posts
export const createLinkedInPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { content, scheduledDate } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = new LinkedInPost({
      userId,
      content,
      scheduledDate: scheduledDate || null,
      posted: false,
    });

    await post.save();

    res.status(201).json({
      message: 'LinkedIn post created successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getPendingLinkedInPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const posts = await LinkedInPost.find({ userId, posted: false }).sort({ createdAt: -1 });

    res.json({
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const markPostAsPosted = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await LinkedInPost.findByIdAndUpdate(
      postId,
      { posted: true, postedDate: new Date() },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      message: 'Post marked as posted',
      post,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Networking Events
export const createNetworkingEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { eventName, date, location, description } = req.body;

    if (!eventName || !date) {
      return res.status(400).json({ error: 'Event name and date are required' });
    }

    const event = new NetworkingEvent({
      userId,
      eventName,
      date,
      location: location || '',
      description: description || '',
    });

    await event.save();

    res.status(201).json({
      message: 'Networking event created successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const events = await NetworkingEvent.find({
      userId,
      date: { $gte: new Date() },
    }).sort({ date: 1 });

    res.json({
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const markEventAsAttended = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { notes } = req.body;

    const event = await NetworkingEvent.findByIdAndUpdate(
      eventId,
      { attended: true, notes: notes || '' },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event marked as attended',
      event,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Professional Goals
export const createProfessionalGoal = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { goalType, title, description, targetDate } = req.body;

    if (!goalType || !title || !targetDate) {
      return res.status(400).json({ error: 'Goal type, title, and target date are required' });
    }

    const goal = new ProfessionalGoal({
      userId,
      goalType,
      title,
      description: description || '',
      targetDate,
    });

    await goal.save();

    res.status(201).json({
      message: 'Professional goal created successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getProfessionalGoals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const goals = await ProfessionalGoal.find({ userId }).sort({ targetDate: 1 });

    res.json({
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const updateProfessionalGoal = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const { progress, status } = req.body;

    const goal = await ProfessionalGoal.findByIdAndUpdate(
      goalId,
      { progress, status },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({
      message: 'Professional goal updated successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
