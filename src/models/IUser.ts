export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  INSTALLER = 'installer',
}

export interface IUser {
  id: number
  email: string
  login: string | null
  fullName: string
  role: UserRole
}
