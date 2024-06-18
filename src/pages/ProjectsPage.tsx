import { PageHeader } from '../components/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'
import { ProjectsGrid } from '../components/ProjectsGrid'

export const ProjectsPage = () => {
  const { t } = useTranslation()

  useDocumentTitle(`${t('app_name')} — ${t('pages.projects')}`)

  return (
    <>
      <PageHeader title="pages.projects" />
      <ProjectsGrid />
    </>
  )
}
