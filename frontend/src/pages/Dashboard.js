import React, { useEffect, useState, useRef } from 'react'
import api from '../api'
import TaskCard from '../components/TaskCard'
import { Link } from 'react-router-dom'
import { getAuth } from '../auth'

export default function Dashboard(){
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [counts, setCounts] = useState({ pending:0, 'in-progress':0, completed:0 })
  const [showFilters, setShowFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const debounceRef = useRef(null)
  const { user } = getAuth()

  useEffect(()=>{
    const check = () => setIsMobile(window.innerWidth <= 720)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  },[])

  useEffect(()=>{
    fetchCounts()
    fetchTasks()
  },[])

  useEffect(()=>{
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(()=> {
      fetchTasks()
    }, 350)
    return ()=> clearTimeout(debounceRef.current)
  },[search, status])

  async function fetchCounts(){
    try {
      const res = await api.get('/tasks')
      const list = Array.isArray(res.data) ? res.data : (res.data.tasks || [])
      const grouped = { pending:0, 'in-progress':0, completed:0 }
      list.forEach(t => { grouped[t.status] = (grouped[t.status] || 0) + 1 })
      setCounts(grouped)
    } catch (e) {}
  }

  async function fetchTasks(){
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (status) params.status = status
      const res = await api.get('/tasks', { params })
      if (Array.isArray(res.data)) {
        setTasks(res.data)
      } else {
        setTasks(res.data.tasks || [])
      }
    } catch (e) {
      setTasks([])
    } finally { setLoading(false) }
  }

  async function handleDelete(id){
    if (!window.confirm('Delete task?')) return
    await api.delete(`/tasks/${id}`)
    fetchTasks()
    fetchCounts()
  }

  function FiltersPanel(){
    return (
      <aside className="sidebar" style={{ width: "100%", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Filters</div>

        <select
          className="select"
          value={status}
          onChange={(e)=> setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending ({counts.pending})</option>
          <option value="in-progress">In Progress ({counts['in-progress']})</option>
          <option value="completed">Completed ({counts.completed})</option>
        </select>

        <div style={{ marginTop: 20 }}>
          <div className="small">Quick stats</div>
          <div className="stats" style={{ marginTop: 8 }}>
            <div className="stat"><div className="small">Pending</div><div className="num">{counts.pending}</div></div>
            <div className="stat"><div className="small">In Progress</div><div className="num">{counts['in-progress']}</div></div>
            <div className="stat"><div className="small">Completed</div><div className="num">{counts.completed}</div></div>
          </div>
        </div>

        <div style={{ marginTop: 15 }}>
          <div className="small">Role</div>
          <div style={{ fontWeight: 700, marginTop: 5 }}>
            {user?.username} ({user?.role})
          </div>
        </div>
      </aside>
    )
  }

  return (
    <div>

    
      <div className="header">
        <div className="brand">
          <div className="logo">TA</div>
          <div>
            <div className="title">TasksApp</div>
            <div className="small">Organize work — track progress</div>
          </div>
        </div>

        <div className="row" style={{ gap: '12px' }}>
          <input
            className="input"
            placeholder="Search tasks by title"
            value={search}
            onChange={(e)=> setSearch(e.target.value)}
            style={{ width: isMobile ? '100%' : '250px' }}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/task/new">
              <button className="btn btn-primary">New Task</button>
            </Link>

            {isMobile && (
              <button
                className="btn btn-ghost"
                onClick={()=> setShowFilters(prev => !prev)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            )}
          </div>
        </div>
      </div>

    
      <div className="container">
        {isMobile && showFilters && <FiltersPanel />}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <div style={{ width: 260 }}>
            <FiltersPanel />
          </div>
        )}

        {/* Main Section */}
        <main className="main" style={{ width: '100%' }}>
          <h2 style={{ marginBottom: 10 }}>Dashboard</h2>

          {loading ? (
            <div>Loading...</div>
          ) : tasks.length === 0 ? (
            <div>No tasks</div>
          ) : (
            <div className="task-grid">
              {tasks.map(t => (
                <TaskCard
                  key={t._id || t.id}
                  task={t}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
