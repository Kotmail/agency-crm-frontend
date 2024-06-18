import { IUser } from './IUser'

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface IProject {
  id: number
  name: string
  priority: Priority | null
  description: string | null
  creator: IUser
  members: IUser[]
  dueDate: Date | null
  createdAt: Date
  taskTotal?: number
  taskCompleted?: number
}
