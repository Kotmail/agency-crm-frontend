import { TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { useTranslation } from 'react-i18next'

export const UserTableHead = () => {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography component="span" sx={visuallyHidden}>
            {t('user_list_table.headings.actions')}
          </Typography>
        </TableCell>
        <TableCell width="5%">ID</TableCell>
        <TableCell width="23.75%">
          {t('user_list_table.headings.login')}
        </TableCell>
        <TableCell width="23.75%">E-mail</TableCell>
        <TableCell width="23.75%">
          {t('user_list_table.headings.full_name')}
        </TableCell>
        <TableCell width="23.75%">
          {t('user_list_table.headings.position')}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}
