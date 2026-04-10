import mongoose, { Schema, Document } from 'mongoose';

export interface IStudySession extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  topic: string;
  hoursSpent: number;
  notes: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudyGoal extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  targetHours: number;
  completedHours: number;
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const studySessionSchema = new Schema<IStudySession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: true,
      enum: ['Data Science', 'Machine Learning', 'Web Development', 'Databases', 'Algorithms', 'System Design', 'Other'],
    },
    topic: {
      type: String,
      required: true,
    },
    hoursSpent: {
      type: Number,
      required: true,
      min: 0.5,
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const studyGoalSchema = new Schema<IStudyGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    targetHours: {
      type: Number,
      required: true,
      min: 1,
    },
    completedHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    deadline: Date,
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const StudySession = mongoose.model<IStudySession>('StudySession', studySessionSchema);
export const StudyGoal = mongoose.model<IStudyGoal>('StudyGoal', studyGoalSchema);
