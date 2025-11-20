import HeroSpline from './components/HeroSpline'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <HeroSpline />

        {/* Title and tagline */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">508 Spendings</h2>
            <p className="text-white/60 text-sm">Log income, track spendings, set recurring contributions. Neon, black-themed.</p>
          </div>
        </div>

        {/* Dashboard */}
        <Dashboard />
      </div>
    </div>
  )
}

export default App
