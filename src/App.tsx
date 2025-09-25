import React, { useEffect, useState } from 'react'
import './App.css'
import type { Task, TaskCreate } from './types'
import * as api from './api'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  // form state
  const [name, setName] = useState('')
  const [execTime, setExecTime] = useState<number>(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await api.listTasks()
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const payload: TaskCreate = { name, exec_time_seconds: execTime, notes }
    const created = await api.createTask(payload)
    setTasks((s) => [created, ...s])
    setName('')
    setExecTime(0)
    setNotes('')
  }

  async function handleDelete(id: number) {
    await api.deleteTask(id)
    setTasks((s) => s.filter((t) => t.id !== id))
  }

  async function handleToggleStatus(t: Task) {
    const next = t.status === 'done' ? 'pending' : 'done'
    const updated = await api.updateTask(t.id, { status: next })
    setTasks((s) => s.map((it) => (it.id === t.id ? updated : it)))
  }

  return (
    <div className="container">
      <h1>Tasks CRUD</h1>
      <section className="card form">
        <h2>Crear tarea</h2>
        <form onSubmit={handleCreate}>
          <label>
            Nombre
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Tiempo (segundos)
            <input
              type="number"
              value={execTime}
              onChange={(e) => setExecTime(Number(e.target.value))}
              min={0}
            />
          </label>
          <label>
            Notas
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <div className="actions">
            <button type="submit">Crear</button>
            <button type="button" onClick={load} disabled={loading}>
              Refrescar
            </button>
          </div>
        </form>
      </section>

      <section className="card list">
        <h2>Lista de tareas</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : tasks.length === 0 ? (
          <p>No hay tareas</p>
        ) : (
          <ul>
            {tasks.map((t) => (
              <li key={t.id} className={t.status === 'done' ? 'done' : ''}>
                <div className="row">
                  <div className="main">
                    <strong>{t.name}</strong>
                    <div className="meta">
                      <span>status: {t.status}</span>
                      <span>exec: {t.exec_time_seconds}s</span>
                      {t.notes ? <span>notes: {t.notes}</span> : null}
                    </div>
                  </div>
                  <div className="controls">
                    <button onClick={() => handleToggleStatus(t)}>
                      {t.status === 'done' ? 'Marcar pending' : 'Marcar done'}
                    </button>
                    <button onClick={() => handleDelete(t.id)}>Eliminar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
