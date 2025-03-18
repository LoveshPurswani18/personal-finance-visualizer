import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Budget from "../../../models/Budget.models";

export async function GET() {
  await connectDB();
  const budgets = await Budget.find({});
  return NextResponse.json(budgets);
}

export async function POST(request: Request) {
  await connectDB();
  const { category, amount } = await request.json();

  if (!category || !amount) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const newBudget = new Budget({
      category,
      amount,
    });
    await newBudget.save();
    return NextResponse.json({
      message: "Budget created successfully",
      budget: newBudget,
    });
  } catch (error) {
    {
      return NextResponse.json(
        { error: "Budget Failed to be created..." },
        { status: 500 }
      );
    }
  }
}

export async function PUT(request: Request) {
    await connectDB();
    const {category, amount} = await request.json();

    const updatedBudget = await Budget.findOneAndUpdate(
        {category},
        {amount},
        {new: true}
    );

    if(!updatedBudget){
        return NextResponse.json({error: "Budget not found"}, {status: 404});
    }

    return NextResponse.json({message: "Budget updated successfully", budget: updatedBudget});
}