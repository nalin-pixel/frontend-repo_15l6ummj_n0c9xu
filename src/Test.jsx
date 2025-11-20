import { useEffect, useState } from 'react'
import SharedView from './components/SharedView'

export default function TestRouterWrapper() {
  const [token, setToken] = useState('')
  useEffect(() => {
    const m = location.pathname.match(/\/share\/(.*)$/)
    if (m) setToken(m[1])
  }, [])

  if (token) return (
    <div className="min-h-screen bg-black text-white max-w-4xl mx-auto p-4">
      <SharedView token={token} />
    </div>
  )

  return null
}
