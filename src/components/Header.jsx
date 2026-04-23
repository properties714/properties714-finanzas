import React from 'react'
import { Plus, TrendingUp } from 'lucide-react'

export default function Header({ onAdd }) {
  return (
    <header className="border-b border-[#1a2540] bg-[#060b18]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">Finanzas</h1>
            <p className="text-indigo-400 text-xs font-medium">Properties714 LLC</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-sm hidden sm:block">Eduardo Escobar · Atlanta, GA</span>
          <button onClick={onAdd} className="btn-primary text-sm">
            <Plus size={16} />
            Nueva transacción
          </button>
        </div>
      </div>
    </header>
  )
}
