import { Request, Response } from 'express';
import Connection from '../models/Network';

export const addConnection = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, email, phone, profession, company, notes, tags } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const connection = new Connection({
      userId,
      name,
      email,
      phone,
      profession,
      company,
      notes: notes || '',
      tags: tags || [],
      lastInteraction: new Date(),
    });

    await connection.save();

    res.status(201).json({
      message: 'Connection added successfully',
      connection,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getAllConnections = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { strength, tag, limit = 50, skip = 0 } = req.query;

    let filter: any = { userId };

    if (strength) {
      filter.connectionStrength = Number(strength);
    }

    if (tag) {
      filter.tags = tag;
    }

    const connections = await Connection.find(filter)
      .sort({ lastInteraction: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Connection.countDocuments(filter);

    res.json({
      total,
      count: connections.length,
      connections,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getConnectionDetails = async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json(connection);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const updateConnection = async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.params;
    const { connectionStrength, notes, nextFollowupDate, tags } = req.body;

    const connection = await Connection.findByIdAndUpdate(
      connectionId,
      {
        connectionStrength,
        notes,
        nextFollowupDate,
        tags,
        lastInteraction: new Date(),
      },
      { new: true }
    );

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json({
      message: 'Connection updated successfully',
      connection,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getConnectionsNeedingFollowup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const connections = await Connection.find({
      userId,
      nextFollowupDate: { $lte: new Date() },
    }).sort({ nextFollowupDate: 1 });

    res.json({
      count: connections.length,
      connections,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const getConnectionsByStrength = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const connections = await Connection.find({ userId });

    const byStrength = connections.reduce((acc: any, conn) => {
      if (!acc[conn.connectionStrength]) {
        acc[conn.connectionStrength] = [];
      }
      acc[conn.connectionStrength].push(conn);
      return acc;
    }, {});

    res.json({
      byStrength,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const searchConnections = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const connections = await Connection.find({
      userId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { profession: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    });

    res.json({
      count: connections.length,
      connections,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const deleteConnection = async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.params;
    const connection = await Connection.findByIdAndDelete(connectionId);

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const addTag = async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.params;
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({ error: 'Tag is required' });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    if (!connection.tags.includes(tag)) {
      connection.tags.push(tag);
      await connection.save();
    }

    res.json({
      message: 'Tag added successfully',
      connection,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
