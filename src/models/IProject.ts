import { IUser } from './IUser'

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface IProject {
  id: number
  name: string
  description: string | null
  dueDate: Date | null
  priority: Priority | null
  creator: IUser
  members: IUser[]
  createdAt: Date
  taskTotal?: number
  taskCompleted?: number
}
