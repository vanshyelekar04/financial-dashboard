import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    _id: { type: String }, // Use provided `id` field as Mongo _id
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true },
    user: { type: String, required: true },
    user_profile: { type: String } // ✅ new field for avatar image
  },
  { timestamps: true, _id: false } // Allow manual string IDs
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
