import React, { useState, useMemo } from 'react'
import { Search, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

const CATEGORY_COLORS = {
  'Zelle': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Renta': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Electricidad': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Internet': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Software': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Legal/LLC': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
}

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function TransactionTable({ transactions, onRefresh, showAll }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return transactions
      .filter(t => {
        if (!q) return true
        return [t.description, t.category, t.subcategory, t.source, t.date, String(t.amount)]
          .some(v => v?.toLowerCase().includes(q))
      })
      .sort((a, b) => {
        let av = a[sortKey] ?? '', bv = b[sortKey] ?? ''
        if (sortKey === 'amount') { av = Number(av); bv = Number(bv) }
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1 : -1
        return 0
      })
  }, [transactions, search, sortKey, sortDir])

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta transacción?')) return
    await supabase.from('financial_transactions').delete().eq('id', id)
    onRefresh()
  }

  function SortIcon({ k }) {
    if (sortKey !== k) return <ChevronUp size={12} className="text-slate-600" />
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-indigo-400" /> : <ChevronDown size={12} className="text-indigo-400" />
  }

  return (
    <div className="card-glow">
      <div className="p-4 border-b border-[#1a2540] flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-8 w-full"
            placeholder="Buscar transacciones..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
        <span className="text-slate-500 text-sm">{filtered.length} resultados</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a2540]">
              {[['date','Fecha'],['type','Tipo'],['category','Categoría'],['description','Descripción'],['amount','Monto'],['source','Fuente'],['','']].map(([k, label]) => (
                <th
                  key={k || label}
                  onClick={() => k && handleSort(k)}
                  className={`text-left px-4 py-3 text-slate-400 font-medium ${k ? 'cursor-pointer hover:text-white' : ''} whitespace-nowrap`}
                >
                  <span className="flex items-center gap-1">
                    {label}
                    {k && <SortIcon k={k} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(t => (
              <tr key={t.id} className="border-b border-[#1a2540]/50 hover:bg-white/[0.02] transition-colors group">
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap font-mono text-xs">{t.date}</td>
                <td className="px-4 py-3">
                  <span className={`badge border ${t.type === 'INGRESO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                    {t.type === 'INGRESO' ? '▲' : '▼'} {t.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge border ${CATEGORY_COLORS[t.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    {t.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{t.description}</td>
                <td className={`px-4 py-3 font-bold whitespace-nowrap ${t.type === 'INGRESO' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.type === 'INGRESO' ? '+' : '-'}{fmt(t.amount)}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{t.source}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all p-1 rounded"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No hay transacciones</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-3 border-t border-[#1a2540] flex items-center justify-between">
          <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} className="btn-ghost text-sm disabled:opacity-40">← Anterior</button>
          <span className="text-slate-500 text-sm">Página {page+1} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page === totalPages-1} className="btn-ghost text-sm disabled:opacity-40">Siguiente →</button>
        </div>
      )}
    </div>
  )
}
