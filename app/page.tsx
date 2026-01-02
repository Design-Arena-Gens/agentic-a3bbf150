'use client'

import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface Expense {
  date: string
  category: string
  amount: number
}

const rawData = `[27/10/2025, 9:39 pm] Nur Mohammad: Tng - 50
[27/10/2025, 9:39 pm] Nur Mohammad: F-20
[28/10/2025, 5:43 pm] Nur Mohammad: F-15
[05/11/2025, 8:04 am] Nur Mohammad: F-25
[05/11/2025, 8:04 am] Nur Mohammad: Shp-60
[05/11/2025, 5:17 pm] Nur Mohammad: F-20
[06/11/2025, 5:21 pm] Nur Mohammad: F-15
[11/11/2025, 9:09 am] Nur Mohammad: F-20
[11/11/2025, 9:10 am] Nur Mohammad: Tng -50
[14/11/2025, 12:09 pm] Nur Mohammad: F-10
[18/11/2025, 11:09 pm] Nur Mohammad: F-10
[18/11/2025, 11:10 pm] Nur Mohammad: Passport -310
[21/11/2025, 7:43 am] Nur Mohammad: F-20
[26/11/2025, 2:28 pm] Nur Mohammad: Tng -100
[26/11/2025, 2:28 pm] Nur Mohammad: F-20
[26/11/2025, 2:28 pm] Nur Mohammad: Mbl-30
[29/11/2025, 12:11 am] Nur Mohammad: F-15
[01/12/2025, 6:40 pm] Nur Mohammad: F-10
[02/12/2025, 6:46 pm] Nur Mohammad: F-5
[06/12/2025, 9:27 am] Nur Mohammad: F-10
[07/12/2025, 11:02 pm] Nur Mohammad: F-20
[09/12/2025, 10:31 am] Nur Mohammad: Coffee - 60
[09/12/2025, 10:31 am] Nur Mohammad: F-10
[10/12/2025, 6:06 pm] Nur Mohammad: F-10
[15/12/2025, 5:30 pm] Nur Mohammad: F-20
[16/12/2025, 2:15 pm] Nur Mohammad: F-25
[18/12/2025, 6:03 pm] Nur Mohammad: F-10
[21/12/2025, 5:22 pm] Nur Mohammad: Sim-25
[21/12/2025, 5:55 pm] Nur Mohammad: F-5
[24/12/2025, 4:21 pm] Nur Mohammad: F-15
[24/12/2025, 4:40 pm] Nur Mohammad: Tng-100
[24/12/2025, 4:40 pm] Nur Mohammad: H-15
[25/12/2025, 4:48 pm] Nur Mohammad: F-10
[28/12/2025, 1:19 pm] Nur Mohammad: F-20
[28/12/2025, 11:59 pm] Nur Mohammad: F-5
[29/12/2025, 6:30 pm] Nur Mohammad: F-5
[29/12/2025, 6:30 pm] Nur Mohammad: Shp-60
[31/12/2025, 8:40 am] Nur Mohammad: F-15
[02/01, 1:15 pm] Nur Mohammad: F-15`

function parseExpenses(data: string): Expense[] {
  const expenses: Expense[] = []
  const lines = data.split('\n')

  for (const line of lines) {
    const dateMatch = line.match(/\[(\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{2})/)
    const contentMatch = line.match(/:\s*(.+?)\s*-\s*(\d+)/)

    if (dateMatch && contentMatch) {
      let dateStr = dateMatch[1]
      if (!dateStr.includes('/2025')) {
        dateStr = dateStr + '/2026'
      }

      const category = contentMatch[1].trim()
      const amount = parseInt(contentMatch[2])

      expenses.push({
        date: dateStr,
        category,
        amount
      })
    }
  }

  return expenses
}

const categoryNames: { [key: string]: string } = {
  'F': 'Food',
  'Tng': 'Transport',
  'Shp': 'Shopping',
  'Passport': 'Passport',
  'Mbl': 'Mobile',
  'Coffee': 'Coffee',
  'Sim': 'SIM',
  'H': 'Health'
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D']

export default function Home() {
  const [expenses] = useState<Expense[]>(parseExpenses(rawData))

  const categoryData = useMemo(() => {
    const totals: { [key: string]: number } = {}

    expenses.forEach(expense => {
      const name = categoryNames[expense.category] || expense.category
      totals[name] = (totals[name] || 0) + expense.amount
    })

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [expenses])

  const monthlyData = useMemo(() => {
    const monthly: { [key: string]: number } = {}

    expenses.forEach(expense => {
      const [day, month, year] = expense.date.split('/')
      const monthKey = `${month}/${year}`
      monthly[monthKey] = (monthly[monthKey] || 0) + expense.amount
    })

    return Object.entries(monthly)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => {
        const [m1, y1] = a.month.split('/').map(Number)
        const [m2, y2] = b.month.split('/').map(Number)
        return y1 === y2 ? m1 - m2 : y1 - y2
      })
  }, [expenses])

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">Expense Tracker</h1>
        <p className="text-center text-gray-600 mb-8">Nur Mohammad's Expenses</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold text-indigo-600">${totalExpense}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Transactions</h3>
            <p className="text-3xl font-bold text-indigo-600">{expenses.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Average per Transaction</h3>
            <p className="text-3xl font-bold text-indigo-600">${(totalExpense / expenses.length).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Category Breakdown</h2>
            <div className="space-y-3">
              {categoryData.map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-gray-700">{cat.name}</span>
                  </div>
                  <span className="font-bold text-gray-800">${cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Category</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice().reverse().map((expense, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{expense.date}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {categoryNames[expense.category] || expense.category}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">
                      ${expense.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
