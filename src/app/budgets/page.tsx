"use client";

import { useState, useEffect } from "react";

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

export default function Budgets() {
  const [budgets, setBudgets] = useState<
    { category: string; amount: number }[]
  >([]);
  const [formData, setFormData] = useState({ category: "", amount: "" });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const res = await fetch("api/budgets");
    const data = await res.json();
    setBudgets(data);
  };

  const handleSubmit = async (E: React.FormEvent) => {
    E.preventDefault();

    await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    setFormData({ category: "", amount: "" });
    fetchBudgets();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Set Budgets</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="border p-2 w-full mb-2 rounded-md"
            required
          >
            <option value="">Seelct Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Budget Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="border p-2 w-full-mb-2 rounded-md"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4">
            Set Budget
          </button>
        </form>
      </div>

      <h2 className="text-xl font-bold mb-4">Current Budgets</h2>
      <ul>
        {budgets.map((budget, index) => (
          <li key={budget.category} className={`border p-4 mb-2 rounded-md ${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}`}>
            {budget.category}: ₹{budget.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
