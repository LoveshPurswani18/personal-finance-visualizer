import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Transaction from "../../../models/Transactions.models";

export async function GET() {

    await connectDB();
    const transactions = await Transaction.find();
    return NextResponse.json(transactions);
}

export async function POST(request: Request) {
    await connectDB();
    const {name, amount, date, category, description} = await request.json();

    if(!name || !amount || !date || !category){
        return NextResponse.json({error: "All fields are required"}, {status: 400});
    }

    const newTransaction = new Transaction({
        name,
        amount,
        date,
        category,
        description
    });
    await newTransaction.save();
    return NextResponse.json({message: "Transaction created successfully"});
}

export async function PUT(request: Request) {
    await connectDB();
    const { _id, name, amount, date, category, description } = await request.json();

    if(!name || !amount || !date || !category){
        return NextResponse.json({error: "All fields are required"}, {status: 400});
    }

    await Transaction.findByIdAndUpdate(_id, {
        name,
        amount,
        date,
        category,
        description
    });
    return NextResponse.json({message: "Transaction updated successfully"});
}

export async function DELETE(request: Request) {
    await connectDB();
    const { _id } = await request.json();

    if(!_id){
        return NextResponse.json({error: "Transaction id is required"}, {status: 400});
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(_id);

    if(!deletedTransaction){
        return NextResponse.json({error: "Transaction not found"}, {status: 404});
    }

    return NextResponse.json({message: "Transaction deleted successfully"});
}

