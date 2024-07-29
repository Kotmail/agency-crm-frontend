import { AvatarProps, styled } from '@mui/material'
import MuiAvatar from '@mui/material/Avatar'
import { IUser } from '../models/IUser'
import { getUserFullName } from '../utils/helpers/getUserFullName'

const Avatar = styled(MuiAvatar)({
  width: 28,
  height: 28,
})

type UserAvatarProps = {
  user: IUser
} & AvatarProps

export const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  const avatarSrc = user.avatar
    ? import.meta.env.VITE_AVATARS_PATH + user.avatar
    : undefined

  return (
    <Avatar src={avatarSrc} alt={getUserFullName(user)} {...props}>
      {`${user.firstName[0]}${user.lastName[0]}`}
    </Avatar>
  )
}
