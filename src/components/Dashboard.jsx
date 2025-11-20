import { useEffect, useMemo, useState } from 'react'
import { Plus, Minus, Share2, BellRing, Wallet, RefreshCcw } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || ''

function NeonCard({ children, className = '' }) {
  return (
    <div className={`rounded-xl bg-black/60 border border-white/10 p-4 shadow-[0_0_40px_rgba(59,130,246,0.15)] ${className}`}>
      {children}
    </div>
  )
}

export default function Dashboard() {
  const [clientId, setClientId] = useState('')
  const [balance, setBalance] = useState(0)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState({})
  const [due, setDue] = useState([])

  const [form, setForm] = useState({ amount: '', category: 'General', note: '', type: 'income' })
  const [rec, setRec] = useState({ label: 'Rainy Day Fund', amount: 500, category: 'Savings', frequency: 'monthly', type: 'income' })

  useEffect(() => {
    const cid = localStorage.getItem('client_id') || crypto.randomUUID()
    localStorage.setItem('client_id', cid)
    setClientId(cid)
  }, [])

  const fetchAll = async (cid) => {
    const b = await fetch(`${API}/api/balance?client_id=${cid}`).then(r=>r.json()).catch(()=>({balance:0}))
    setBalance(b.balance || 0)
    const tx = await fetch(`${API}/api/transactions?client_id=${cid}&limit=200`).then(r=>r.json()).catch(()=>({items:[]}))
    setItems(tx.items || [])
    const cats = await fetch(`${API}/api/categories?client_id=${cid}`).then(r=>r.json()).catch(()=>({categories:{}}))
    setCategories(cats.categories || {})
    const rem = await fetch(`${API}/api/reminders?client_id=${cid}`).then(r=>r.json()).catch(()=>({due:[]}))
    setDue(rem.due || [])
  }

  useEffect(() => { if (clientId) fetchAll(clientId) }, [clientId])

  const addTransaction = async () => {
    if (!form.amount) return
    await fetch(`${API}/api/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: Number(form.amount), client_id: clientId }) })
    setForm({ ...form, amount: '', note: '' })
    fetchAll(clientId)
  }

  const addRecurring = async () => {
    await fetch(`${API}/api/recurring`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...rec, client_id: clientId, amount: Number(rec.amount) }) })
    fetchAll(clientId)
  }

  const share = async () => {
    const res = await fetch(`${API}/api/share`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: clientId }) }).then(r=>r.json())
    const url = `${location.origin}/share/${res.token}`
    await navigator.clipboard.writeText(url)
    alert('Share link copied to clipboard!')
  }

  const totalByType = useMemo(() => {
    let income = 0, expense = 0
    items.forEach(i => { if (i.amount >= 0) income += i.amount; else expense += Math.abs(i.amount) })
    return { income, expense }
  }, [items])

  return (
    <div className="space-y-6">
      {/* Reminder banner */}
      {due.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 p-3 flex items-center gap-3">
          <BellRing className="w-5 h-5" />
          <div className="text-sm">You have pending contributions: {due.map(d=>`${d.label} (${d.amount})`).join(', ')}. Don’t forget your Rainy Day Fund.</div>
        </div>
      )}

      {/* Top cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <NeonCard>
          <div className="flex items-center gap-3">
            <Wallet className="text-cyan-400" />
            <div>
              <div className="text-xs text-white/60">Current Balance</div>
              <div className="text-2xl text-white font-semibold">${balance.toFixed(2)}</div>
            </div>
          </div>
        </NeonCard>
        <NeonCard>
          <div className="text-xs text-white/60">Totals</div>
          <div className="flex gap-6 mt-1">
            <div className="text-green-400">+${totalByType.income.toFixed(2)}</div>
            <div className="text-rose-400">-${totalByType.expense.toFixed(2)}</div>
          </div>
        </NeonCard>
        <NeonCard>
          <div className="text-xs text-white/60 mb-2">Categories</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([k,v]) => (
              <span key={k} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white/70">{k}: {v.toFixed(2)}</span>
            ))}
            {Object.keys(categories).length===0 && <span className="text-white/50 text-sm">No categories yet</span>}
          </div>
        </NeonCard>
      </div>

      {/* Add transaction */}
      <NeonCard>
        <div className="flex flex-col md:flex-row gap-3">
          <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-full" />
          <input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-full" />
          <input placeholder="Note (optional)" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-full" />
          <button onClick={addTransaction} className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded px-3 py-2 hover:bg-cyan-500/30">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </NeonCard>

      {/* Recurring */}
      <NeonCard>
        <div className="flex items-center justify-between mb-3">
          <div className="text-white/80 text-sm">Recurring Contribution</div>
          <button onClick={addRecurring} className="inline-flex items-center gap-2 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 rounded px-3 py-2 hover:bg-fuchsia-500/30">
            <RefreshCcw className="w-4 h-4" /> Save recurring
          </button>
        </div>
        <div className="grid md:grid-cols-5 gap-3">
          <input placeholder="Label" value={rec.label} onChange={e=>setRec({...rec, label:e.target.value})} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-full" />
          <input type="number" placeholder="Amount" value={rec.amount} onChange={e=>setRec({...rec, amount:e.target.value})} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-full" />
          <input placeholder="Category" value={rec.category} onChange={e=>setRec({...rec, category:e.target.value})} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-full" />
          <select value={rec.frequency} onChange={e=>setRec({...rec, frequency:e.target.value})} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
          <select value={rec.type} onChange={e=>setRec({...rec, type:e.target.value})} className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </NeonCard>

      {/* Logs and mini chart */}
      <div className="grid md:grid-cols-2 gap-4">
        <NeonCard>
          <div className="text-white/80 text-sm mb-3">Recent Activity</div>
          <div className="space-y-2 max-h-80 overflow-auto pr-1">
            {items.map(i => (
              <div key={i._id} className="flex items-center justify-between bg-white/5 rounded px-3 py-2 border border-white/10">
                <div className="text-white/80 text-sm">
                  <div className="font-medium">{i.category} <span className="text-white/50">• {new Date(i.date).toLocaleDateString()}</span></div>
                  {i.note && <div className="text-white/60 text-xs">{i.note}</div>}
                </div>
                <div className={i.amount>=0? 'text-green-400' : 'text-rose-400'}>{i.amount>=0? '+' : '-'}${Math.abs(i.amount).toFixed(2)}</div>
              </div>
            ))}
            {items.length===0 && <div className="text-white/50 text-sm">No transactions yet</div>}
          </div>
        </NeonCard>
        <NeonCard>
          <div className="text-white/80 text-sm mb-3">Category Breakdown</div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(categories).map(([k,v]) => (
              <div key={k} className="bg-white/5 rounded p-3 border border-white/10">
                <div className="text-white/70 text-xs mb-1">{k}</div>
                <div className="h-2 rounded bg-white/10 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${Math.min(100, Math.abs(v))}%` }} />
                </div>
                <div className="text-white/80 text-sm mt-1">{v.toFixed(2)}</div>
              </div>
            ))}
            {Object.keys(categories).length===0 && <div className="text-white/50 text-sm">No data</div>}
          </div>
        </NeonCard>
      </div>

      {/* Share */}
      <div className="flex justify-end">
        <button onClick={share} className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded px-4 py-2 hover:bg-emerald-500/30">
          <Share2 className="w-4 h-4" /> Share dashboard
        </button>
      </div>
    </div>
  )
}
