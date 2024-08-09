import { useParams } from 'react-router-dom'
import { useOneProjectQuery } from '../redux/api/projectsApi'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Alert, CircularProgress } from '@mui/material'
import { ProjectDetail } from '../components/ProjectDetail'
import { useEffect } from 'react'

export const ProjectPage = () => {
  const { id } = useParams()
  const {
    data: project,
    isLoading,
    isError,
  } = useOneProjectQuery(Number(id) || 0)
  const { t } = useTranslation()
  const [, setDocumentTitle] = useDocumentTitle(t('app_name'))

  useEffect(() => {
    if (project) {
      setDocumentTitle(`${t('app_name')} — ${t(project.name)}`)
    }
  }, [project])

  if (isLoading) {
    return <CircularProgress />
  }

  if (isError) {
    return <Alert severity="error">{t('alerts.projects.request_error')}</Alert>
  }

  return project && <ProjectDetail project={project} />
}
