const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000'

export async function listTasks() {
  const resp = await fetch(`${API_BASE}/tasks`)
  if (!resp.ok) throw new Error('failed')
  return resp.json()
}

export async function createTask(payload: any) {
  const resp = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!resp.ok) throw new Error('failed')
  return resp.json()
}

export async function updateTask(id: number, payload: any) {
  const resp = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!resp.ok) throw new Error('failed')
  return resp.json()
}

export async function deleteTask(id: number) {
  const resp = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
  if (!resp.ok) throw new Error('failed')
  return resp.json()
}
