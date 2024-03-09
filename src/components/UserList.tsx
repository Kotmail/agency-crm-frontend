import { FC, useEffect, useState } from 'react'
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { MoreHoriz, Edit, Delete, SvgIconComponent } from '@mui/icons-material'
import { visuallyHidden } from '@mui/utils'
import { useDeleteUserMutation, useUsersQuery } from '../redux/api/usersApi'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../hooks/useAppSelector'
import { ConfirmDialog, ConfirmDialogProps } from './dialogs/ConfirmDialog'
import { enqueueSnackbar } from 'notistack'
import { IUser } from '../models/IUser'
import { UserFormDialog, UserFormDialogProps } from './dialogs/UserFormDialog'
import { useDialogs } from '../hooks/useDialogs'
import { DIALOG_BASE_OPTIONS } from '../utils/consts'

type DialogVariants = {
  userForm: UserFormDialogProps
  confirm: ConfirmDialogProps
}

type DropdownOption = {
  key: 'edit' | 'delete'
  icon: SvgIconComponent
}

const dropdownOptions: DropdownOption[] = [
  {
    key: 'edit',
    icon: Edit,
  },
  {
    key: 'delete',
    icon: Delete,
  },
]

export const UserList: FC = () => {
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersLoadingError,
  } = useUsersQuery()
  const { user: authUser } = useAppSelector((state) => state.auth)
  const [deleteUser, { isSuccess: isDeleteSuccess, isError: isDeleteError }] =
    useDeleteUserMutation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<null | IUser>(null)
  const [dialogs, openDialog, closeDialog] = useDialogs<DialogVariants>({
    userForm: {
      open: false,
    },
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.deleteUser,
      confirmBtnHandler: () => deleteUserHandler(),
    },
  })
  const isActionsMenuOpened = Boolean(anchorEl)
  const { t } = useTranslation()

  const openActionsMenuHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    user: IUser,
  ) => {
    setSelectedUser(user)
    setAnchorEl(event.currentTarget)
  }
  const closeActionsMenuHandler = () => setAnchorEl(null)

  const selectOptionHandler = (optionKey: DropdownOption['key']) => {
    switch (optionKey) {
      case 'edit':
        openDialog('userForm', {
          ...DIALOG_BASE_OPTIONS.form.editUser,
          user: selectedUser,
        })
        break
      case 'delete':
        openDialog('confirm')
        break
    }

    closeActionsMenuHandler()
  }

  const deleteUserHandler = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id)
    }

    closeDialog('confirm')
  }

  useEffect(() => {
    if (isDeleteSuccess) {
      enqueueSnackbar(t('notifications.delete_user.success'), {
        variant: 'success',
      })
    }

    if (isDeleteError) {
      enqueueSnackbar(t('notifications.delete_user.fail'), {
        variant: 'error',
      })
    }
  }, [isDeleteSuccess, isDeleteError])

  if (isUsersLoading) {
    return <CircularProgress />
  }

  if (isUsersLoadingError) {
    return <Typography>Error...</Typography>
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 992 }}
          size="small"
          aria-label={t('user_list_table.label')}
        >
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
          <TableBody>
            {users &&
              users.map((user) => (
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
                      aria-controls={
                        isActionsMenuOpened ? 'userActionsMenu' : undefined
                      }
                      aria-expanded={isActionsMenuOpened ? 'true' : undefined}
                      onClick={(e) => openActionsMenuHandler(e, user)}
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
        {dropdownOptions.map((option) => {
          if (
            selectedUser &&
            selectedUser.id === authUser?.id &&
            option.key === 'delete'
          ) {
            return false
          }

          return (
            <MenuItem
              key={option.key}
              dense
              onClick={() => selectOptionHandler(option.key)}
            >
              <ListItemIcon>
                <option.icon fontSize="small" />
              </ListItemIcon>
              {t(`actions.${option.key}`)}
            </MenuItem>
          )
        })}
      </Menu>
      <UserFormDialog {...dialogs.userForm} />
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
