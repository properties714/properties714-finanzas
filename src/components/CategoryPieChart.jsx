import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ec4899','#3b82f6','#8b5cf6','#ef4444','#06b6d4']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-[#0d1424] border border-[#1a2540] rounded-xl p-3 shadow-xl">
      <p className="text-white font-medium">{name}</p>
      <p className="text-indigo-400 font-bold">${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
    </div>
  )
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  )
}

export default function CategoryPieChart({ transactions, expensesOnly, subcategory }) {
  const data = useMemo(() => {
    const src = expensesOnly || !subcategory
      ? transactions.filter(t => t.type === 'GASTO')
      : transactions

    const key = subcategory ? 'subcategory' : 'category'
    const map = {}
    src.forEach(t => {
      const k = t[key] || 'Otros'
      map[k] = (map[k] || 0) + Number(t.amount)
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value)
  }, [transactions, expensesOnly, subcategory])

  const title = subcategory ? 'Gastos por Tipo' : (expensesOnly ? 'Gastos por Categoría' : 'Distribución')

  return (
    <div className="card-glow p-5">
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-slate-500 text-xs mb-4">Proporción de cada categoría</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={<CustomLabel />}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>}
            wrapperStyle={{ paddingTop: 8 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
