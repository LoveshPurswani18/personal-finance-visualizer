"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

type Transaction = {
  _id: string;
  amount: number;
  category: string;
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number }[]
  >([]);

  const [budgets, setBudgets] = useState<
    { category: string; amount: number }[]
  >([]);
  const [budgetVsActual, setBudgetVsActual] = useState<
    { category: string; budget: number; actual: number }[]
  >([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      fetchBudgets(transactions);
    }
  }, [transactions]);

  const fetchBudgets = async (transactionList: Transaction[]) => {
    const res = await fetch("/api/budgets");
    const data = await res.json();
    setBudgets(data);

    if (transactionList.length === 0) return;

    const comparision = data.map((budget: any) => {
      const actual = transactions
        .filter((transaction) => transaction.category === budget.category)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return { category: budget.category, budget: budget.amount, actual };
    });

    setBudgetVsActual(comparision);
  };

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);

    const totalExpense = data.reduce(
      (sum: number, transaction: Transaction) => sum + transaction.amount,
      0
    );
    setTotalExpense(totalExpense);

    fetchBudgets(data);

    const categoryMap: { [key: string]: number } = {};
    data.forEach((transactions: Transaction) => {
      categoryMap[transactions.category] =
        (categoryMap[transactions.category] || 0) + transactions.amount;
    });

    setCategoryData(
      Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
    );
  };

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"];

  const categoryColorMap = categoryData.reduce((acc, curr, index) => {
    acc[curr.name] = COLORS[index % COLORS.length];
    return acc;
  }, {} as { [key: string]: string });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="bg-gray-200 shadow-md rounded-lg p-6 flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Total Expenses: </h2>
        <p className="text-2xl font-bold text-red-500">₹{totalExpense}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
        <ResponsiveContainer width={"100%"} height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey={"value"}
              nameKey={"name"}
              cx={"50%"}
              cy={"50%"}
              outerRadius={100}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cel-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Budget Vs Actual Spending</h2>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={budgetVsActual}>
            <XAxis dataKey={"category"} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={"budget"} fill="#8884d8" />
            <Bar dataKey={"actual"} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Recent Transactions</h2>
      <ul>
        {transactions.slice(0, 5).map((transactions) => (
          <li
            key={transactions._id}
            className="border rounded-md p-4 mb-2"
            style={{
              color: categoryColorMap[transactions.category] || "#000000",
            }}
          >
            {transactions.category} - ₹{transactions.amount}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-4">Spending Insights</h2>
      <ul>
        {budgetVsActual.map((item) => (
          <li
            key={item.category}
            className={`p-4 mb-2 rounded-md ${
              item.actual > item.budget ? "bg-red-200 border-l-4 border-red-500" : "bg-green-200 border-l-4 border-green-500"
            }`}
          >
            {item.category}: ₹{item.actual} spent (Budget: ₹{item.budget})
            {item.actual > item.budget && (
              <span className="text-red-600 font-bold"> - Overspent!</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
