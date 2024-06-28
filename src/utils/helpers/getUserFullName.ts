import { IUser } from '../../models/IUser'

export const getUserFullName = (user: IUser) => {
  return `${user.firstName} ${user.lastName}`
}
