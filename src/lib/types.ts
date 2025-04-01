export type TaskStatus = "To Do" | "In Progress" | "Completed"
export type TaskPriority = "High" | "Medium" | "Low"

export interface Subtask {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  favorite: boolean
  createdAt: string
  subtasks: Subtask[]
}

