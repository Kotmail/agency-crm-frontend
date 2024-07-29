import { IProject, Priority } from './IProject'
import { IUser } from './IUser'

export enum TaskStatus {
  UNSORTED = 'unsorted',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  COMPLETED = 'completed',
}

export interface ITask {
  id: number
  name: string
  description: string | null
  dueDate: Date | null
  status: TaskStatus
  priority: Priority | null
  creator: IUser
  project: IProject
  responsibleUsers: IUser[]
  createdAt: Date
}
