import React, { useState } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { saveAuth } from '../auth'

export default function Register(){
  const nav = useNavigate()
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [show,setShow] = useState(false)
  const [err,setErr] = useState('')

  async function submit(e){
    e.preventDefault()
    setErr('')
    try{
      const res = await api.post('/register',{ username,email,password })
      saveAuth(res.data.token, res.data.user)
      nav('/')
    }catch(e){
      setErr(e.response?.data?.message || 'Error creating account')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-title">Create an Account</div>

      <form className="auth-form" onSubmit={submit}>
        
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={e=>setUsername(e.target.value)}
          required
        />

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
          Register
        </button>
      </form>

      {err && <div style={{color:'red',marginTop:10,textAlign:'center'}}>{err}</div>}

      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </div>
    </div>
  )
}
