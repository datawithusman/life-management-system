import mongoose, { Schema, Document } from 'mongoose';

export interface ILinkedInPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  scheduledDate?: Date;
  posted: boolean;
  postedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface INetworkingEvent extends Document {
  userId: mongoose.Types.ObjectId;
  eventName: string;
  date: Date;
  location: string;
  description: string;
  attended: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfessionalGoal extends Document {
  userId: mongoose.Types.ObjectId;
  goalType: 'masters' | 'phd' | 'job' | 'skill' | 'other';
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const linkedInPostSchema = new Schema<ILinkedInPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 3000,
    },
    scheduledDate: Date,
    posted: {
      type: Boolean,
      default: false,
    },
    postedDate: Date,
  },
  { timestamps: true }
);

const networkingEventSchema = new Schema<INetworkingEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    attended: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  { timestamps: true }
);

const professionalGoalSchema = new Schema<IProfessionalGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    goalType: {
      type: String,
      enum: ['masters', 'phd', 'job', 'skill', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
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
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
  },
  { timestamps: true }
);

export const LinkedInPost = mongoose.model<ILinkedInPost>('LinkedInPost', linkedInPostSchema);
export const NetworkingEvent = mongoose.model<INetworkingEvent>('NetworkingEvent', networkingEventSchema);
export const ProfessionalGoal = mongoose.model<IProfessionalGoal>('ProfessionalGoal', professionalGoalSchema);
