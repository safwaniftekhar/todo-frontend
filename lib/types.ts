// User types
export interface User {
  id: string
  name: string
  email: string
  image?: string
}

// Role types
export type Role = "owner" | "editor" | "viewer"

export interface Collaborator extends User {
  role: Role
}

// Task types
export interface Task {
  id: string
  title: string
  completed: boolean
  description?: string
  dueDate?: string
  priority?: "low" | "medium" | "high"
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

// ToDo list types
export interface TodoList {
  id: string
  title: string
  description?: string
  tasks: Task[]
  collaborators: Collaborator[]
  createdAt: string
  updatedAt: string
  ownerId: string
}
