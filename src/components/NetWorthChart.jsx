import React, { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'

function fmtY(v) {
  return `$${(v/1000).toFixed(0)}k`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d1424] border border-[#1a2540] rounded-xl p-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-sm font-semibold">
          {p.name}: ${Number(p.value).toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </p>
      ))}
    </div>
  )
}

export default function NetWorthChart({ transactions }) {
  const data = useMemo(() => {
    const sorted = [...transactions]
      .filter(t => t.date && !t.date.includes('PENDIENTE'))
      .sort((a, b) => a.date.localeCompare(b.date))

    const months = {}
    sorted.forEach(t => {
      const key = t.date.slice(0, 7)
      if (!months[key]) months[key] = { income: 0, expenses: 0 }
      if (t.type === 'INGRESO') months[key].income += Number(t.amount)
      else months[key].expenses += Number(t.amount)
    })

    let cumIncome = 0, cumExpenses = 0
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => {
        cumIncome += v.income
        cumExpenses += v.expenses
        const [yr, mo] = key.split('-')
        const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
        return {
          month: `${monthNames[parseInt(mo)-1]} ${yr}`,
          'Ingresos Acum.': Math.round(cumIncome),
          'Gastos Acum.': Math.round(cumExpenses),
          'Flujo Neto': Math.round(cumIncome - cumExpenses)
        }
      })
  }, [transactions])

  return (
    <div className="card-glow p-5">
      <h3 className="text-white font-semibold mb-1">Flujo Acumulado (2024 → 2026)</h3>
      <p className="text-slate-500 text-xs mb-4">Ingresos vs gastos totales acumulados en el tiempo</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
          <YAxis tickFormatter={fmtY} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="Ingresos Acum." stroke="#10b981" strokeWidth={2} fill="url(#gradIncome)" dot={false} />
          <Area type="monotone" dataKey="Gastos Acum." stroke="#ef4444" strokeWidth={2} fill="url(#gradExpenses)" dot={false} />
          <Area type="monotone" dataKey="Flujo Neto" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradNet)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
