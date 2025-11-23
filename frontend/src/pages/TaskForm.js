import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function TaskForm(){
  const { id } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState({ title:'', description:'', status:'pending' })
  const [err, setErr] = useState('')
  useEffect(()=>{ if (id) load() },[id])
  async function load(){
    try {
      const res = await api.get(`/tasks/${id}`)
      setForm({ title: res.data.title, description: res.data.description, status: res.data.status })
    } catch (e) {}
  }
  async function submit(e){
    e.preventDefault()
    setErr('')
    try {
      if (id) await api.put(`/tasks/${id}`, form)
      else await api.post('/tasks', form)
      nav('/')
    } catch (e) {
      setErr(e.response?.data?.message || 'Error')
    }
  }
  return (
    <div>
      <h2 style={{marginBottom:12}}>{id ? 'Edit Task' : 'Create Task'}</h2>
      <form className="form" onSubmit={submit}>
        <div className="form-row">
          <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
        </div>
        <div className="form-row">
          <textarea className="input" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{minHeight:120}} />
        </div>
        <div className="form-row">
          <select className="select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
            <option value="pending">pending</option>
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
          </select>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-primary" type="submit">Save</button>
          <button type="button" className="btn btn-ghost" onClick={()=>nav('/')}>Cancel</button>
        </div>
        {err && <div className="small" style={{color:'red'}}>{err}</div>}
      </form>
    </div>
  )
}
