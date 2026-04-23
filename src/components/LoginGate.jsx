import React, { useState } from 'react'
import { Lock, Eye, EyeOff, TrendingUp } from 'lucide-react'

const ACCESS_HASH = '55dfd375064b8e5f5a1d8170286d7af9f8fb19f56efd3063149c32f92c5bf310'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function LoginGate({ onAuth }) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const hash = await sha256(password)
    if (hash === ACCESS_HASH) {
      sessionStorage.setItem('p714_auth', '1')
      onAuth()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060b18] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-900/50">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-white font-bold text-2xl">Finanzas</h1>
          <p className="text-indigo-400 text-sm mt-1">Properties714 LLC — Acceso privado</p>
        </div>

        <form onSubmit={handleSubmit} className="card-glow p-6 border border-[#1a2540]">
          <div className="flex items-center gap-2 mb-5 text-slate-400 text-sm">
            <Lock size={14} />
            <span>Solo para Eduardo Escobar</span>
          </div>

          <div className="relative mb-4">
            <input
              type={show ? 'text' : 'password'}
              className={`input w-full pr-10 ${error ? 'border-rose-500/60' : ''}`}
              placeholder="Contraseña de acceso"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-rose-400 text-sm mb-4 bg-rose-500/10 px-3 py-2 rounded-lg">
              Contraseña incorrecta
            </p>
          )}

          <button type="submit" disabled={loading || !password} className="btn-primary w-full justify-center">
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-4">finanzas.properties714.com</p>
      </div>
    </div>
  )
}
