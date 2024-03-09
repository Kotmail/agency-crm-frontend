import { FC } from 'react'
import { UserList } from '../../components/UserList'
import { DIALOG_BASE_OPTIONS } from '../../utils/consts'
import { useDialogs } from '../../hooks/useDialogs'
import {
  UserFormDialog,
  UserFormDialogProps,
} from '../../components/dialogs/UserFormDialog'
import { PageHeader } from '../../components/PageHeader'
import { CreateEntityButton } from '../../components/CreateEntityButton'

type DialogVariants = {
  userForm: UserFormDialogProps
}

export const UsersPage: FC = () => {
  const [dialogs, openDialog] = useDialogs<DialogVariants>({
    userForm: {
      open: false,
    },
  })

  return (
    <>
      <PageHeader title="page_header.titles.users">
        <CreateEntityButton
          text="buttons.new_user"
          onClick={() =>
            openDialog('userForm', DIALOG_BASE_OPTIONS.form.addUser)
          }
        />
      </PageHeader>
      <UserList />
      <UserFormDialog {...dialogs.userForm} />
    </>
  )
}
