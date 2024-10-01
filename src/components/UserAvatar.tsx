import { forwardRef } from 'react'
import { AvatarProps, styled } from '@mui/material'
import MuiAvatar from '@mui/material/Avatar'
import MuiTooltip, { TooltipProps } from '@mui/material/Tooltip'
import { IUser } from '../models/IUser'
import { getUserFullName } from '../utils/helpers/getUserFullName'

type UserAvatarProps = {
  user: IUser
  tooltip?: string
} & AvatarProps

export const UserAvatar = ({ user, tooltip, ...props }: UserAvatarProps) => {
  const avatarSrc = user.avatar
    ? import.meta.env.VITE_AVATARS_PATH + user.avatar
    : undefined

  const AvatarCircle = forwardRef<HTMLDivElement>((props, ref) => (
    <Avatar ref={ref} src={avatarSrc} alt={getUserFullName(user)} {...props}>
      {`${user.firstName[0]}${user.lastName[0]}`}
    </Avatar>
  ))

  return tooltip ? (
    <Tooltip title={tooltip}>
      <AvatarCircle {...props} />
    </Tooltip>
  ) : (
    <AvatarCircle {...props} />
  )
}

const Avatar = styled(MuiAvatar)({
  width: 28,
  height: 28,
})

const Tooltip = styled((props: TooltipProps) => (
  <MuiTooltip
    arrow
    placement="top"
    slotProps={{
      popper: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -7],
            },
          },
        ],
      },
    }}
    {...props}
  />
))({})
