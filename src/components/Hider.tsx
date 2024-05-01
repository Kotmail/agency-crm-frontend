import { PropsWithChildren } from 'react'
import { UserRole } from '../models/IUser'
import { useAppSelector } from '../hooks/useAppSelector'

type HiderProps = {
  roles: UserRole[]
} & PropsWithChildren

export const Hider = ({ children, roles }: HiderProps) => {
  const { user } = useAppSelector((state) => state.auth)

  return user && roles.includes(user.role) ? null : children
}
