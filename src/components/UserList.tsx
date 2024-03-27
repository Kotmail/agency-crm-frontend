import { useEffect, useState } from 'react'
import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
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
import { ActionItem, ActionItemKeys, ActionsDropdown } from './ActionsDropdown'
import { TableBackdropLoader } from './TableBackdropLoader'

type DialogVariants = {
  userForm: UserFormDialogProps
  confirm: ConfirmDialogProps
}

const actions: ActionItem[] = [
  {
    key: 'edit',
    icon: Edit,
  },
  {
    key: 'delete',
    icon: Delete,
  },
]

export const UserList = () => {
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersLoadingError,
    isFetching: isUsersFetching,
  } = useUsersQuery()
  const { user: authUser } = useAppSelector((state) => state.auth)
  const [deleteUser, { isSuccess: isDeleteSuccess, isError: isDeleteError }] =
    useDeleteUserMutation()
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
  const { t } = useTranslation()

  const selectActionHandler = (optionKey: ActionItemKeys) => {
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
  }

  const deleteUserHandler = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id)
    }

    closeDialog('confirm')
  }

  const getSpecificActions = () => {
    return authUser && selectedUser
      ? actions.filter((action) =>
          authUser.id === selectedUser.id ? action.key !== 'delete' : action,
        )
      : actions
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
    return <Alert severity="error">{t('alerts.users.request_error')}</Alert>
  }

  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ position: 'relative' }}
      >
        <TableBackdropLoader open={isUsersFetching} />
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
                    <ActionsDropdown
                      actions={getSpecificActions()}
                      onSelectHandler={selectActionHandler}
                      onClick={() => setSelectedUser(user)}
                      ariaLabel="user_list_table.headings.actions"
                    />
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
      <UserFormDialog {...dialogs.userForm} />
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
