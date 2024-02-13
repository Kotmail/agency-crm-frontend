import { IUser } from './IUser'

export enum OrderPriorities {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum OrderStatuses {
  WAITING = 'waiting',
  ACCEPTED = 'accepted',
  DONE = 'done',
}

export interface IOrder {
  id: number
  description: string
  brand: string
  cost: number
  creator: IUser
  executor: IUser
  priority: OrderPriorities
  status: OrderStatuses
  deadline: string
  isArchived?: boolean
  createdAt: Date
}
