export type Task = {
  id: number
  name: string
  status: string
  exec_time_seconds: number
  created_at: string
  updated_at: string
  notes?: string
}

export type TaskCreate = {
  name: string
  exec_time_seconds?: number
  status?: string
  notes?: string
}

export type TaskUpdate = Partial<TaskCreate>
