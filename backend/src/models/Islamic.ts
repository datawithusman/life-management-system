import mongoose, { Schema, Document } from 'mongoose';

export interface IIslamicPractice extends Document {
  userId: mongoose.Types.ObjectId;
  practiceType: string;
  date: Date;
  completed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuranProgress extends Document {
  userId: mongoose.Types.ObjectId;
  surahName: string;
  versesRead: number;
  totalVerses: number;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const islamicPracticeSchema = new Schema<IIslamicPractice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    practiceType: {
      type: String,
      required: true,
      enum: ['Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha', 'Quran Reading', 'Dua', 'Charity', 'Islamic Study', 'Other'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const quranProgressSchema = new Schema<IQuranProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    surahName: {
      type: String,
      required: true,
    },
    versesRead: {
      type: Number,
      required: true,
      min: 0,
    },
    totalVerses: {
      type: Number,
      required: true,
      min: 1,
    },
    completedDate: Date,
  },
  { timestamps: true }
);

export const IslamicPractice = mongoose.model<IIslamicPractice>('IslamicPractice', islamicPracticeSchema);
export const QuranProgress = mongoose.model<IQuranProgress>('QuranProgress', quranProgressSchema);
