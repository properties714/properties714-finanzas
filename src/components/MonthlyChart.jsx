import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts'

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function fmtY(v) {
  if (v >= 1000) return `$${(v/1000).toFixed(0)}k`
  return `$${v}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d1424] border border-[#1a2540] rounded-xl p-3 shadow-xl">
      <p className="text-white font-semibold mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-sm">
          {p.name}: ${Number(p.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  )
}

export default function MonthlyChart({ transactions, year, incomeOnly }) {
  const data = useMemo(() => {
    const years = year === 'Todos'
      ? [...new Set(transactions.map(t => t.date?.slice(0,4)))].sort()
      : [year]

    return MONTHS.map((m, i) => {
      const row = { month: m }
      years.forEach(y => {
        const txs = transactions.filter(t => {
          const d = t.date || ''
          return d.startsWith(y) && parseInt(d.slice(5,7)) === i + 1
        })
        row[`Ingresos ${y}`] = txs.filter(t => t.type === 'INGRESO').reduce((s, t) => s + Number(t.amount), 0)
        if (!incomeOnly) {
          row[`Gastos ${y}`] = txs.filter(t => t.type === 'GASTO').reduce((s, t) => s + Number(t.amount), 0)
        }
      })
      return row
    })
  }, [transactions, year, incomeOnly])

  const keys = Object.keys(data[0] || {}).filter(k => k !== 'month')
  const COLORS = ['#6366f1','#10b981','#f59e0b','#ec4899','#ef4444','#8b5cf6']

  return (
    <div className="card-glow p-5">
      <h3 className="text-white font-semibold mb-1">Ingresos {!incomeOnly && '& Gastos'} por Mes</h3>
      <p className="text-slate-500 text-xs mb-4">{year === 'Todos' ? 'Todos los años' : year}</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmtY} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
          <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px', color: '#94a3b8' }} />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} radius={[4,4,0,0]} maxBarSize={32} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
