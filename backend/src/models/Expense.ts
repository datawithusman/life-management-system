import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  description: string;
  date: Date;
  type: 'expense' | 'income';
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  month: Date;
  totalBudget: number;
  categories: {
    category: string;
    limit: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Transport', 'Education', 'Entertainment', 'Health', 'Utilities', 'Shopping', 'Other'],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'],
      default: 'Cash',
    },
  },
  { timestamps: true }
);

const budgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Date,
      required: true,
    },
    totalBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    categories: [
      {
        category: {
          type: String,
          required: true,
        },
        limit: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
