import { Alert, Box, CircularProgress, Pagination } from '@mui/material'
import { ProjectCard } from './ProjectCard'
import { useProjectsQuery } from '../redux/api/projectsApi'
import { useTranslation } from 'react-i18next'
import { usePagination } from '../hooks/usePagination'

type UserTableProps = {
  itemsPerPage?: number
}

export const ProjectsGrid = ({ itemsPerPage }: UserTableProps) => {
  const [paginationData, setPage] = usePagination({ take: itemsPerPage || 12 })
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    isError: isProjectsLoadingError,
    isFetching: isProjectsFetching,
  } = useProjectsQuery(paginationData)
  const { t } = useTranslation()

  if (isProjectsLoading) {
    return <CircularProgress />
  }

  if (isProjectsLoadingError) {
    return <Alert severity="error">{t('alerts.projects.request_error')}</Alert>
  }

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
        gap={2}
      >
        {projectsData &&
          projectsData.items.map((project) => (
            <ProjectCard key={project.id} item={project} />
          ))}
      </Box>
      {projectsData && projectsData.totalCount > paginationData.take && (
        <Pagination
          disabled={isProjectsFetching}
          count={Math.ceil(projectsData.totalCount / paginationData.take)}
          page={paginationData.page}
          onChange={(_, page) => setPage(page)}
          sx={{ marginTop: '25px' }}
        />
      )}
    </>
  )
}
