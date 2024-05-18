import { TableCell, TableRow } from '@mui/material'
import { ActionItem, ActionItemKeys, ActionsDropdown } from '../ActionsDropdown'
import { IUser } from '../../models/IUser'
import { useTranslation } from 'react-i18next'

type UserTableRowProps = {
  user: IUser
  actionsDropdownItems: ActionItem[]
  onSelectActionHandler: (user: IUser, action: ActionItemKeys) => void
}

export const UserTableRow = ({
  user,
  actionsDropdownItems,
  onSelectActionHandler,
}: UserTableRowProps) => {
  const { t } = useTranslation()

  return (
    <TableRow
      key={user.id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell>
        <ActionsDropdown
          actions={actionsDropdownItems}
          onSelectHandler={(action) => onSelectActionHandler(user, action)}
          ariaLabel="user_list_table.headings.actions"
        />
      </TableCell>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.login || '—'}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.fullName}</TableCell>
      <TableCell>{t(`user_roles.${user?.role}`)}</TableCell>
    </TableRow>
  )
}
