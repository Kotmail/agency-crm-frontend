import { useEffect } from 'react'
import {
  Alert,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { useDeleteUserMutation, useUsersQuery } from '../../redux/api/usersApi'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../hooks/useAppSelector'
import { ConfirmDialog, ConfirmDialogProps } from '../dialogs/ConfirmDialog'
import { enqueueSnackbar } from 'notistack'
import { IUser } from '../../models/IUser'
import { UserFormDialog, UserFormDialogProps } from '../dialogs/UserFormDialog'
import { useDialogs } from '../../hooks/useDialogs'
import { DIALOG_BASE_OPTIONS } from '../../utils/consts'
import { ActionItem, ActionItemKeys } from '../ActionsDropdown'
import { TableBackdropLoader } from '../TableBackdropLoader'
import { UserTableRow } from './UserTableRow'
import { UserTableHead } from './UserTableHead'
import { usePagination } from '../../hooks/usePagination'

type DialogVariants = {
  userForm: UserFormDialogProps
  confirm: ConfirmDialogProps
}

type UserTableProps = {
  itemsPerPage?: number
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

export const UserTable = ({ itemsPerPage }: UserTableProps) => {
  const [paginationData, setPage] = usePagination({ take: itemsPerPage || 10 })
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersLoadingError,
    isFetching: isUsersFetching,
  } = useUsersQuery(paginationData)
  const { user: authUser } = useAppSelector((state) => state.auth)
  const [deleteUser, { isSuccess: isDeleteSuccess, isError: isDeleteError }] =
    useDeleteUserMutation()
  const [dialogs, openDialog, closeDialog] = useDialogs<DialogVariants>({
    userForm: {
      open: false,
    },
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.deleteUser,
      confirmBtnHandler: () => {},
    },
  })
  const { t } = useTranslation()

  const selectActionHandler = (user: IUser, action: ActionItemKeys) => {
    switch (action) {
      case 'edit':
        openDialog('userForm', {
          ...DIALOG_BASE_OPTIONS.form.editUser,
          user,
        })
        break
      case 'delete':
        openDialog('confirm', {
          ...DIALOG_BASE_OPTIONS.confirm.deleteUser,
          confirmBtnHandler: () => deleteUserHandler(user.id),
        })
        break
    }
  }

  const deleteUserHandler = (id: number) => {
    deleteUser(id)

    closeDialog('confirm')
  }

  const getDropdownActions = (id: number) => {
    return authUser
      ? actions.filter((action) =>
          authUser.id === id ? action.key !== 'delete' : action,
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
  }, [isDeleteSuccess, isDeleteError, t])

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
          <UserTableHead />
          <TableBody>
            {usersData &&
              usersData.items.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  actionsDropdownItems={getDropdownActions(user.id)}
                  onSelectActionHandler={selectActionHandler}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {usersData && usersData.totalCount > paginationData.take && (
        <Pagination
          disabled={isUsersFetching}
          count={Math.ceil(usersData.totalCount / paginationData.take)}
          page={paginationData.page}
          onChange={(_, page) => setPage(page)}
          sx={{ marginTop: '25px' }}
        />
      )}
      <UserFormDialog {...dialogs.userForm} />
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
