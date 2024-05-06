import { TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { Hider } from '../Hider'
import { UserRole } from '../../models/IUser'
import { useTranslation } from 'react-i18next'

export const OrderTableHead = () => {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow>
        <Hider roles={[UserRole.EXECUTOR]}>
          <TableCell width="4%">
            <Typography component="span" sx={visuallyHidden}>
              {t('order_list_table.headings.actions')}
            </Typography>
          </TableCell>
        </Hider>
        <TableCell width="7%">№</TableCell>
        <TableCell width="9%">
          {t('order_list_table.headings.deadline')}
        </TableCell>
        <TableCell width="15%">
          {t('order_list_table.headings.description')}
        </TableCell>
        <TableCell width="12%">
          {t('order_list_table.headings.object_address')}
        </TableCell>
        <TableCell width="9%">
          {t('order_list_table.headings.priority')}
        </TableCell>
        <TableCell width="8%">{t('order_list_table.headings.brand')}</TableCell>
        <Hider roles={[UserRole.MANAGER]}>
          <TableCell width="9%">
            {t('order_list_table.headings.creator')}
          </TableCell>
        </Hider>
        <Hider roles={[UserRole.EXECUTOR]}>
          <TableCell width="9%">
            {t('order_list_table.headings.executor')}
          </TableCell>
        </Hider>
        <TableCell width="7%">{t('order_list_table.headings.cost')}</TableCell>
        <TableCell width="11%">
          {t('order_list_table.headings.status')}
        </TableCell>
      </TableRow>
    </TableHead>
  )
}
