import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

export default function SharedView({ token }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!token) return
    fetch(`${API}/api/share/${token}`).then(r=>r.json()).then(setData).catch(()=>setData({error:true}))
  }, [token])

  if (!data) return <div className="text-white/60">Loading...</div>
  if (data.detail) return <div className="text-rose-400">Invalid or expired share link.</div>

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Public Dashboard</div>
      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
        <div className="text-white/60 text-sm mb-2">Balance</div>
        <div className="text-3xl">${data.balance.toFixed(2)}</div>
      </div>
      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
        <div className="text-white/60 text-sm mb-2">Category Chart</div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(data.categories || {}).map(([k,v]) => (
            <div key={k} className="bg-black/40 rounded p-3 border border-white/10">
              <div className="text-white/70 text-xs mb-1">{k}</div>
              <div className="h-2 rounded bg-white/10 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${Math.min(100, Math.abs(v))}%` }} />
              </div>
              <div className="text-white/80 text-sm mt-1">{v.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
        <div className="text-white/60 text-sm mb-2">Logs</div>
        <div className="space-y-2 max-h-96 overflow-auto">
          {(data.items || []).map(i => (
            <div key={i._id} className="flex items-center justify-between bg-white/5 rounded px-3 py-2 border border-white/10">
              <div className="text-white/80 text-sm">
                <div className="font-medium">{i.category} <span className="text-white/50">• {new Date(i.date).toLocaleDateString()}</span></div>
                {i.note && <div className="text-white/60 text-xs">{i.note}</div>}
              </div>
              <div className={i.amount>=0? 'text-green-400' : 'text-rose-400'}>{i.amount>=0? '+' : '-'}${Math.abs(i.amount).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
