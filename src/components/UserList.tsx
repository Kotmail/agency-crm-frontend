import { FC, useState } from "react";
import { CircularProgress, IconButton, ListItemIcon, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { MoreHoriz, Edit, Delete } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { useUsersQuery } from "../redux/api/userApi";
import { useTranslation } from "react-i18next";

export const UserList: FC = () => {
  const { data: users, isLoading: isUsersLoading, isError: isUsersLoadingError } = useUsersQuery()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isActionsMenuOpened = Boolean(anchorEl);
  const { t } = useTranslation()
  
  const openActionsMenuHandler = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const closeActionsMenuHandler = () => setAnchorEl(null);

  if (isUsersLoading) {
    return <CircularProgress />
  }

  if (isUsersLoadingError) {
    return <Typography>Error...</Typography>
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 992 }} size="small" aria-label={t('user_list_table.label')}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography component="span" sx={visuallyHidden}>{t('user_list_table.headings.actions')}</Typography>
              </TableCell>
              <TableCell width='5%'>ID</TableCell>
              <TableCell width='23.75%'>{t('user_list_table.headings.login')}</TableCell>
              <TableCell width='23.75%'>E-mail</TableCell>
              <TableCell width='23.75%'>{t('user_list_table.headings.full_name')}</TableCell>
              <TableCell width='23.75%'>{t('user_list_table.headings.position')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.map(user => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <IconButton
                    id="userActionsBtn"
                    aria-label={t('user_list_table.headings.actions')}
                    size="small"
                    aria-haspopup="true"
                    aria-controls={isActionsMenuOpened ? 'userActionsMenu' : undefined}
                    aria-expanded={isActionsMenuOpened ? 'true' : undefined}
                    onClick={openActionsMenuHandler}
                  >
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.login}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{t(`user.roles.${user?.role}`)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        id="userActionsMenu"
        anchorEl={anchorEl}
        open={isActionsMenuOpened}
        onClose={closeActionsMenuHandler}
        MenuListProps={{
          'aria-labelledby': 'userActionsBtn',
        }}
      >
        <MenuItem dense onClick={closeActionsMenuHandler}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          {t('user_list_table.actions.edit')}
        </MenuItem>
        <MenuItem dense onClick={closeActionsMenuHandler}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          {t('user_list_table.actions.delete')}
        </MenuItem>
      </Menu>
    </>
  );
}