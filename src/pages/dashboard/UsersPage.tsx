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
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'

type DialogVariants = {
  userForm: UserFormDialogProps
}

export const UsersPage: FC = () => {
  const { t } = useTranslation()
  const [dialogs, openDialog] = useDialogs<DialogVariants>({
    userForm: {
      open: false,
    },
  })

  useDocumentTitle(`${t('app_name')} — ${t(`page_header.titles.users`)}`)

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
