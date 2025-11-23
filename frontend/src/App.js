import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TaskForm from './pages/TaskForm'
import ProtectedRoute from './components/ProtectedRoute'
import { getAuth, clearAuth } from './auth'

export default function App(){
  const nav = useNavigate()
  const { user } = getAuth()

  return (
    <div className="app">
      <div className="header">
        <Link to="/" className="app-title">TasksApp</Link>

        {user && (
          <div className="header-user">
            <span style={{ fontWeight: 600 }}>Hi, {user.username} ({user.role})</span>
            <button
              className="btn btn-primary"
              onClick={()=>{
                clearAuth()
                nav('/login')
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/task/new" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
        <Route path="/task/edit/:id" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}
