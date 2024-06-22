import { PageHeader } from '../components/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'
import { ProjectsGrid } from '../components/ProjectsGrid'
import { useDialogs } from '../hooks/useDialogs'
import {
  ProjectFormDialog,
  ProjectFormDialogProps,
} from '../components/dialogs/ProjectFormDialog'
import { Hider } from '../components/Hider'
import { Button } from '@mui/material'
import { UserRole } from '../models/IUser'

type DialogVariants = {
  projectForm: ProjectFormDialogProps
}

export const ProjectsPage = () => {
  const [dialogs, openDialog] = useDialogs<DialogVariants>({
    projectForm: {
      open: false,
    },
  })
  const { t } = useTranslation()

  useDocumentTitle(`${t('app_name')} — ${t('pages.projects')}`)

  return (
    <>
      <PageHeader title="pages.projects">
        <Hider roles={[UserRole.EXECUTOR]}>
          <Button onClick={() => openDialog('projectForm')}>
            {t('buttons.new_project')}
          </Button>
        </Hider>
      </PageHeader>
      <ProjectsGrid />
      <ProjectFormDialog {...dialogs.projectForm} />
    </>
  )
}
