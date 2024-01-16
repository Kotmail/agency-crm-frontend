export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  INSTALLER = 'installer',
}

export interface IUser {
  id: number
  email: string
  login: string
  fullName: string
  role: UserRole
}
