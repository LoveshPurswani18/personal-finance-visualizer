"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Transaction = {
  _id: string;
  name: string;
  amount: number;
  date: Date;
  category: string;
  description: string;
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<
    { month: string; total: number }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    date: new Date(),
    category: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    setMonthlyExpenses(getMonthlyExpenses(transactions));
  }, [transactions]);

  const getMonthlyExpenses = (transactions: Transaction[]) => {
    const expensesMap: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      expensesMap[month] = (expensesMap[month] || 0) + transaction.amount;
    });

    return Object.entries(expensesMap).map(([month, total]) => ({
      month,
      total,
    }));
  };

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
    setMonthlyExpenses(getMonthlyExpenses(data));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting Transaction: ", formData);

    const url = editingId ? "/api/transactions" : "/api/transactions";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        _id: editingId,
      }),
    });

    setFormData({
      name: "",
      amount: 0,
      date: new Date(),
      category: "",
      description: "",
    });
    setEditingId(null);
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/transactions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log("Error: ", errorData.error);
      alert(errorData.error || "Something went wrong");
    } else {
      fetchTransactions();
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction._id);
    setFormData({
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category,
      description: transaction.description,
    });
  };

  const categories = [
    "Food",
    "Clothing",
    "Entertainment",
    "Utilities",
    "Transportation",
    "Health",
    "Personal",
    "Other",
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border rounded-md p-3 w-full"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
          }
          className="border rounded-md p-3 w-full"
        />
        <input
          type="date"
          value={
            formData.date
              ? new Date(formData.date).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setFormData({ ...formData, date: new Date(e.target.value) })
          }
          className="border rounded-md p-3 w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border rounded-md p-3 w-full"
        />

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="border rounded-md p-3 w-lg"
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 ml-3"
        >
          {editingId ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">All Transactions</h2>
        <div className="max-h-80 overflow-y-auto">
          <ul>
            {transactions.map((transaction) => (
              <li
                key={transaction._id}
                className="border border-gray-300 rounded-md p-4 mb-4"
              >
                <div>
                  <strong>{transaction.name}</strong> - ₹{transaction.amount} on{" "}
                  {new Date(transaction.date).toLocaleDateString()}
                  <p className="text-sm text-gray-600">
                  Category: 
                    <span className="font-semibold">{transaction.category}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="bg-yellow-500 text-white rounded-md px-4 py-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="bg-red-500 text-white rounded-md px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyExpenses}>
            <XAxis dataKey="month" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
