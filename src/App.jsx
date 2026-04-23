import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from './lib/supabase.js'
import Header from './components/Header.jsx'
import SummaryCards from './components/SummaryCards.jsx'
import MonthlyChart from './components/MonthlyChart.jsx'
import CategoryPieChart from './components/CategoryPieChart.jsx'
import NetWorthChart from './components/NetWorthChart.jsx'
import TransactionTable from './components/TransactionTable.jsx'
import AddTransactionModal from './components/AddTransactionModal.jsx'

const YEARS = ['Todos', '2024', '2025', '2026']
const TABS = ['Resumen', 'Ingresos', 'Gastos', 'Transacciones']

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState('Todos')
  const [tab, setTab] = useState('Resumen')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const { data } = await supabase
      .from('financial_transactions')
      .select('*')
      .order('date', { ascending: false })
    setTransactions(data || [])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    if (year === 'Todos') return transactions
    return transactions.filter(t => t.date?.startsWith(year))
  }, [transactions, year])

  const income = useMemo(() => filtered.filter(t => t.type === 'INGRESO'), [filtered])
  const expenses = useMemo(() => filtered.filter(t => t.type === 'GASTO'), [filtered])

  const totalIncome = income.reduce((s, t) => s + Number(t.amount), 0)
  const totalExpenses = expenses.reduce((s, t) => s + Number(t.amount), 0)
  const netIncome = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-[#060b18]">
      <Header onAdd={() => setShowAdd(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Year Filter */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-slate-400 text-sm font-medium mr-2">Año:</span>
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                year === y
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                  : 'bg-[#0d1424] text-slate-400 hover:text-white border border-[#1a2540] hover:border-indigo-500/50'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#0d1424] p-1 rounded-2xl border border-[#1a2540] w-fit">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="animate-in">
            {tab === 'Resumen' && (
              <div className="space-y-6">
                <SummaryCards
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                  netIncome={netIncome}
                  incomeCount={income.length}
                  expenseCount={expenses.length}
                  year={year}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MonthlyChart transactions={filtered} year={year} />
                  <CategoryPieChart transactions={filtered} />
                </div>
                <NetWorthChart transactions={transactions} />
              </div>
            )}

            {tab === 'Ingresos' && (
              <div className="space-y-6">
                <SummaryCards
                  totalIncome={totalIncome}
                  totalExpenses={0}
                  netIncome={totalIncome}
                  incomeCount={income.length}
                  expenseCount={0}
                  year={year}
                  incomeOnly
                />
                <MonthlyChart transactions={filtered} year={year} incomeOnly />
                <TransactionTable transactions={income} onRefresh={loadData} />
              </div>
            )}

            {tab === 'Gastos' && (
              <div className="space-y-6">
                <SummaryCards
                  totalIncome={0}
                  totalExpenses={totalExpenses}
                  netIncome={-totalExpenses}
                  incomeCount={0}
                  expenseCount={expenses.length}
                  year={year}
                  expensesOnly
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CategoryPieChart transactions={filtered} expensesOnly />
                  <CategoryPieChart transactions={filtered} subcategory />
                </div>
                <TransactionTable transactions={expenses} onRefresh={loadData} />
              </div>
            )}

            {tab === 'Transacciones' && (
              <TransactionTable transactions={filtered} onRefresh={loadData} showAll />
            )}
          </div>
        )}
      </div>

      {showAdd && (
        <AddTransactionModal
          onClose={() => setShowAdd(false)}
          onSave={() => { setShowAdd(false); loadData() }}
        />
      )}
    </div>
  )
}
