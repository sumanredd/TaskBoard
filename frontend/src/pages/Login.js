import React, { useState } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { saveAuth } from '../auth'

export default function Login(){
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [show,setShow] = useState(false)
  const [err,setErr] = useState('')

  async function submit(e){
    e.preventDefault()
    setErr('')
    try{
      const res = await api.post('/login',{ email,password })
      saveAuth(res.data.token, res.data.user)
      nav('/')
    }catch(e){
      setErr(e.response?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-title">Login</div>

      <form className="auth-form" onSubmit={submit}>

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          type="email"
          required
        />

        <div style={{position:'relative'}}>
          <input
            className="input"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            type={show ? "text" : "password"}
            required
          />
          <span
            onClick={()=>setShow(!show)}
            style={{
              position:'absolute',
              right:'12px',
              top:'50%',
              transform:'translateY(-50%)',
              cursor:'pointer',
              fontSize:'14px',
              color:'#64748b'
            }}
          >
            {show ? "Hide" : "Show"}
          </span>
        </div>

        <button className="btn btn-primary" type="submit" style={{width:'100%'}}>
          Login
        </button>
      </form>

      {err && <div style={{color:'red',marginTop:10,textAlign:'center'}}>{err}</div>}

      <div className="auth-footer">
        Don’t have an account? <Link to="/register" className="auth-link">Register</Link>
      </div>
    </div>
  )
}
