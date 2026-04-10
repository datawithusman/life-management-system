import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  completedDate?: Date;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
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
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: {
      type: String,
      required: true,
      enum: ['Study', 'Professional', 'Business', 'Personal', 'Health', 'Islamic', 'Other'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedDate: Date,
    recurring: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'none'],
      default: 'none',
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema);
