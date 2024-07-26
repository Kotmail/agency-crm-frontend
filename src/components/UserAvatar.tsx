import { Avatar, AvatarProps } from '@mui/material'
import { IUser } from '../models/IUser'
import { getUserFullName } from '../utils/helpers/getUserFullName'

type UserAvatarProps = {
  user: IUser
} & AvatarProps

export const UserAvatar = ({ user, sx }: UserAvatarProps) => {
  const avatarSrc = user.avatar
    ? import.meta.env.VITE_AVATARS_PATH + user.avatar
    : undefined

  return (
    <Avatar src={avatarSrc} alt={getUserFullName(user)} sx={sx}>
      {`${user.firstName[0]}${user.lastName[0]}`}
    </Avatar>
  )
}
