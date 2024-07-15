import { HTMLAttributes } from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { IUser } from '../models/IUser'
import { getUserFullName } from '../utils/helpers/getUserFullName'

type AutocompleteUserOptionProps = {
  user: IUser
} & HTMLAttributes<HTMLLIElement>

export const AutocompleteUserOption = ({
  user,
  ...props
}: AutocompleteUserOptionProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="10px"
      component="li"
      {...props}
      sx={{
        '&:not(:last-child)': {
          borderBottom: '1px solid #f2f2f2',
        },
      }}
    >
      <Avatar alt={getUserFullName(user)} sx={{ width: 36, height: 36 }} />
      <Box>
        <Typography display="block" variant="subtitle2" marginBottom=".15em">
          {getUserFullName(user)}
        </Typography>
        <Typography display="block" variant="caption">
          {user.email}
        </Typography>
      </Box>
    </Box>
  )
}
