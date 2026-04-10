import mongoose, { Schema, Document } from 'mongoose';

export interface ILongTermGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  targetDate: Date;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  milestones: {
    title: string;
    targetDate: Date;
    completed: boolean;
    completedDate?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<ILongTermGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Career', 'Personal', 'Financial', 'Health', 'Spiritual', 'Education', 'Business', 'Other'],
      required: true,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'on_hold'],
      default: 'not_started',
    },
    milestones: [
      {
        title: {
          type: String,
          required: true,
        },
        targetDate: {
          type: Date,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedDate: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ILongTermGoal>('Goal', goalSchema);
