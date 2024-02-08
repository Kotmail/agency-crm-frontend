import { IUser } from './IUser'

enum OrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

enum OrderStatus {
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
  priority: OrderPriority
  status: OrderStatus
  deadline: Date
  isArchived: boolean
}
