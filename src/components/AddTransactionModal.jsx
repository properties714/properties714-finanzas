import React, { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

const CATEGORIES = {
  INGRESO: ['Zelle', 'Rent Income', 'Otro Ingreso'],
  GASTO: ['Renta', 'Electricidad', 'Internet', 'Software', 'Legal/LLC', 'Combustible', 'Comida', 'Seguro', 'Otro Gasto']
}

export default function AddTransactionModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'INGRESO',
    category: 'Zelle',
    subcategory: 'Negocio',
    description: '',
    amount: '',
    source: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(k, v) {
    setForm(f => {
      const next = { ...f, [k]: v }
      if (k === 'type') next.category = CATEGORIES[v][0]
      return next
    })
  }

  async function handleSave() {
    if (!form.date || !form.amount || !form.description) {
      setError('Fecha, monto y descripción son requeridos')
      return
    }
    setSaving(true)
    const { error: err } = await supabase.from('financial_transactions').insert([{
      ...form,
      amount: parseFloat(form.amount)
    }])
    if (err) { setError(err.message); setSaving(false); return }
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-glow w-full max-w-lg p-6 animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Nueva Transacción</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1 block">Tipo</label>
              <select className="input w-full" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="INGRESO">INGRESO</option>
                <option value="GASTO">GASTO</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1 block">Categoría</label>
              <select className="input w-full" value={form.category} onChange={e => set('category', e.target.value)}>
                {(CATEGORIES[form.type] || []).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1 block">Fecha</label>
              <input type="date" className="input w-full" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1 block">Monto ($)</label>
              <input type="number" step="0.01" className="input w-full" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Descripción</label>
            <input className="input w-full" placeholder="Ej: Zelle de cliente, Renta mensual..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1 block">Subcategoría</label>
              <select className="input w-full" value={form.subcategory} onChange={e => set('subcategory', e.target.value)}>
                <option value="Personal">Personal</option>
                <option value="Negocio">Negocio</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1 block">Fuente</label>
              <input className="input w-full" placeholder="Chase, Xfinity..." value={form.source} onChange={e => set('source', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Notas (opcional)</label>
            <input className="input w-full" placeholder="Notas adicionales..." value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>

          {error && <p className="text-rose-400 text-sm bg-rose-500/10 px-3 py-2 rounded-lg">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-ghost border border-[#1a2540] justify-center">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary justify-center">
            {saving ? 'Guardando...' : 'Guardar Transacción'}
          </button>
        </div>
      </div>
    </div>
  )
}
