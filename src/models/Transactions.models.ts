import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        enum: ["Food", "Clothing", "Entertainment", "Utilities", "Transportation", "Health", "Personal", "Other"],
        required: true,
    },
    description: {
        type: String,
    }
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);