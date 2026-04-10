import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  duration: number;
  intensity: 'light' | 'moderate' | 'intense';
  calories: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHealthMetric extends Document {
  userId: mongoose.Types.ObjectId;
  weight?: number;
  height?: number;
  bloodPressure?: string;
  heartRate?: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Cardio', 'Strength', 'Yoga', 'Sports', 'Stretching', 'Swimming', 'Running', 'Other'],
    },
    duration: {
      type: Number,
      required: true,
      min: 5,
    },
    intensity: {
      type: String,
      enum: ['light', 'moderate', 'intense'],
      default: 'moderate',
    },
    calories: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const healthMetricSchema = new Schema<IHealthMetric>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weight: {
      type: Number,
      min: 20,
      max: 300,
    },
    height: {
      type: Number,
      min: 100,
      max: 250,
    },
    bloodPressure: String,
    heartRate: {
      type: Number,
      min: 30,
      max: 200,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
export const HealthMetric = mongoose.model<IHealthMetric>('HealthMetric', healthMetricSchema);
