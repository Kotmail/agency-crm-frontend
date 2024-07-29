import MuiAvatarGroup, {
  AvatarGroupProps as MuiAvatarGroupProps,
} from '@mui/material/AvatarGroup'
import { IUser } from '../models/IUser'
import { UserAvatar } from './UserAvatar'
import { styled } from '@mui/material'

const Group = styled(MuiAvatarGroup)({
  marginLeft: '-2px',
  '.MuiAvatar-root': {
    width: 24,
    height: 24,
    fontSize: 12,
  },
})

type AvatarGroupProps = {
  users: IUser[]
} & MuiAvatarGroupProps

export const AvatarGroup = ({ users, ...props }: AvatarGroupProps) => {
  if (!users.length) {
    return null
  }

  return (
    <Group total={users.length} max={4} {...props}>
      {users.map((user) => (
        <UserAvatar user={user} key={user.id} />
      ))}
    </Group>
  )
}
