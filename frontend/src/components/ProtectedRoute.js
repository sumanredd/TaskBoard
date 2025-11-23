import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../api'
import { getAuth } from '../auth'
export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null)
  const { token } = getAuth()
  useEffect(() => {
    if (!token) return setOk(false)
    api.get('/me').then(() => setOk(true)).catch(() => setOk(false))
  }, [token])
  if (ok === null) return <div>Loading...</div>
  if (!ok) return <Navigate to="/login" replace />
  return children
}
