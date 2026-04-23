import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

function Card({ title, value, subtitle, icon: Icon, color, trend }) {
  const colors = {
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: 'text-emerald-400', glow: 'shadow-emerald-900/20' },
    red: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: 'text-rose-400', glow: 'shadow-rose-900/20' },
    blue: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', icon: 'text-indigo-400', glow: 'shadow-indigo-900/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: 'text-purple-400', glow: 'shadow-purple-900/20' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className={`card-glow p-5 border ${c.border} shadow-lg ${c.glow}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend !== undefined && (
          <span className={`badge ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend).toFixed(0)}%
          </span>
        )}
      </div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <p className={`text-2xl font-bold ${c.text}`}>{fmt(value)}</p>
      {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
    </div>
  )
}

export default function SummaryCards({ totalIncome, totalExpenses, netIncome, incomeCount, expenseCount, year, incomeOnly, expensesOnly }) {
  const label = year === 'Todos' ? 'acumulado' : year

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {!expensesOnly && (
        <Card
          title={`Ingresos ${label}`}
          value={totalIncome}
          subtitle={`${incomeCount} transacciones`}
          icon={TrendingUp}
          color="green"
        />
      )}
      {!incomeOnly && (
        <Card
          title={`Gastos ${label}`}
          value={totalExpenses}
          subtitle={`${expenseCount} transacciones`}
          icon={TrendingDown}
          color="red"
        />
      )}
      {!incomeOnly && !expensesOnly && (
        <Card
          title={`Ingreso Neto ${label}`}
          value={netIncome}
          subtitle={netIncome > 0 ? 'Flujo positivo' : 'Revisar gastos'}
          icon={DollarSign}
          color={netIncome >= 0 ? 'blue' : 'red'}
        />
      )}
      {!incomeOnly && !expensesOnly && totalIncome > 0 && (
        <Card
          title="Margen Neto"
          value={(netIncome / totalIncome) * 100}
          subtitle="% de ingresos retenidos"
          icon={Minus}
          color="purple"
        />
      )}
      {incomeOnly && (
        <Card title="Promedio por transacción" value={incomeCount > 0 ? totalIncome / incomeCount : 0} subtitle="Zelle promedio" icon={DollarSign} color="blue" />
      )}
      {expensesOnly && (
        <Card title="Promedio mensual" value={expenseCount > 0 ? totalExpenses / (expenseCount / 4) : 0} subtitle="Estimado gastos/mes" icon={DollarSign} color="purple" />
      )}
    </div>
  )
}
