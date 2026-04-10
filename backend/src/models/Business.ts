import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  userId: mongoose.Types.ObjectId;
  courseName: string;
  platform: string;
  progressPercentage: number;
  totalModules: number;
  completedModules: number;
  startDate: Date;
  estimatedEndDate?: Date;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

export interface IClientFollowup extends Document {
  userId: mongoose.Types.ObjectId;
  clientName: string;
  projectName: string;
  lastContact: Date;
  nextFollowupDate: Date;
  notes?: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IIncomeSource extends Document {
  userId: mongoose.Types.ObjectId;
  sourceName: string;
  amount: number;
  frequency: 'one-time' | 'daily' | 'weekly' | 'monthly';
  lastReceived: Date;
  nextExpected?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ['Udemy', 'Coursera', 'Udacity', 'Pluralsight', 'LinkedIn Learning', 'Other'],
      default: 'Other',
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalModules: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedModules: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    estimatedEndDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const clientFollowupSchema = new Schema<IClientFollowup>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      default: '',
    },
    lastContact: {
      type: Date,
      default: Date.now,
    },
    nextFollowupDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const incomeSourceSchema = new Schema<IIncomeSource>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sourceName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    frequency: {
      type: String,
      enum: ['one-time', 'daily', 'weekly', 'monthly'],
      default: 'monthly',
    },
    lastReceived: Date,
    nextExpected: Date,
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>('Course', courseSchema);
export const ClientFollowup = mongoose.model<IClientFollowup>('ClientFollowup', clientFollowupSchema);
export const IncomeSource = mongoose.model<IIncomeSource>('IncomeSource', incomeSourceSchema);
