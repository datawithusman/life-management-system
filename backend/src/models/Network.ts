import mongoose, { Schema, Document } from 'mongoose';

export interface IConnection extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  profession?: string;
  company?: string;
  connectionStrength: number;
  lastInteraction: Date;
  nextFollowupDate?: Date;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema = new Schema<IConnection>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    phone: String,
    profession: String,
    company: String,
    connectionStrength: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    lastInteraction: {
      type: Date,
      default: Date.now,
    },
    nextFollowupDate: Date,
    notes: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IConnection>('Connection', connectionSchema);
