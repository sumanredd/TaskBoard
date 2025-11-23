import React from 'react'
import { Link } from 'react-router-dom'
import { getAuth } from '../auth'

export default function TaskCard({ task, onDelete }){
  const { user } = getAuth()
  const ownerId = task.createdBy?._id || task.createdBy
  const canEdit = user && (user.role === 'admin' || String(ownerId) === String(user.id))
  const canDelete = canEdit || (user && user.role === 'admin')

  function StatusBadge({ status }){
    if (status === 'pending') return <div className="badge badge-pending">Pending</div>
    if (status === 'in-progress') return <div className="badge badge-inprogress">In Progress</div>
    if (status === 'completed') return <div className="badge badge-completed">Completed</div>
    return <div className="badge">{status}</div>
  }

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <div className="small">By: {task.createdBy?.username || 'You'}</div>
      <div className="task-desc">{task.description || 'No description'}</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div className="small">{new Date(task.createdAt).toLocaleString()}</div>
        <div className="actions">
          {canEdit && <Link to={`/task/edit/${task._id || task.id}`}><button className="action-btn btn-ghost">Edit</button></Link>}
          {canDelete && <button className="action-btn btn-ghost" onClick={()=>onDelete(task._id || task.id)}>Delete</button>}
        </div>
      </div>
      {task.editedByAdmin && <div className="small" style={{color:'#0f172a',fontWeight:700}}>Edited by admin</div>}
    </div>
  )
}
