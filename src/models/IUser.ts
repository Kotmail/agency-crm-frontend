export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EXECUTOR = 'executor',
}

export interface IUser {
  id: number
  email: string
  login: string | null
  fullName: string
  role: UserRole
}
