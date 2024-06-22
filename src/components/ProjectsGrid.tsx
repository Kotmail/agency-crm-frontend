import { Alert, Box, CircularProgress, Pagination } from '@mui/material'
import { ProjectCard } from './ProjectCard'
import {
  useDeleteProjectMutation,
  useProjectsQuery,
} from '../redux/api/projectsApi'
import { useTranslation } from 'react-i18next'
import { usePagination } from '../hooks/usePagination'
import { ActionItem, ActionItemKeys } from './ActionsDropdown'
import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material'
import { IProject } from '../models/IProject'
import { useDialogs } from '../hooks/useDialogs'
import {
  ProjectFormDialog,
  ProjectFormDialogProps,
} from './dialogs/ProjectFormDialog'
import { ConfirmDialog, ConfirmDialogProps } from './dialogs/ConfirmDialog'
import { DIALOG_BASE_OPTIONS } from '../utils/consts'
import { useEffect } from 'react'
import { enqueueSnackbar } from 'notistack'

const actions: ActionItem[] = [
  {
    key: 'edit',
    icon: EditOutlined,
  },
  {
    key: 'delete',
    icon: DeleteOutlineOutlined,
  },
]

type DialogVariants = {
  projectForm: ProjectFormDialogProps
  confirm: ConfirmDialogProps
}

type ProjectsGridProps = {
  itemsPerPage?: number
}

export const ProjectsGrid = ({ itemsPerPage }: ProjectsGridProps) => {
  const [paginationData, setPage] = usePagination({ take: itemsPerPage || 12 })
  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    isError: isProjectsLoadingError,
    isFetching: isProjectsFetching,
  } = useProjectsQuery(paginationData)
  const [
    deleteProject,
    { isSuccess: isDeleteSuccess, isError: isDeleteError },
  ] = useDeleteProjectMutation()
  const [dialogs, openDialog, closeDialog] = useDialogs<DialogVariants>({
    projectForm: {
      open: false,
    },
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.deleteProject,
      confirmBtnHandler: () => {},
    },
  })
  const { t } = useTranslation()

  const selectActionHandler = (project: IProject, action: ActionItemKeys) => {
    switch (action) {
      case 'edit':
        openDialog('projectForm', {
          ...DIALOG_BASE_OPTIONS.form.editProject,
          project,
        })
        break
      case 'delete':
        openDialog('confirm', {
          ...DIALOG_BASE_OPTIONS.confirm.deleteProject,
          confirmBtnHandler: () => deleteProjectHandler(project.id),
        })
        break
    }
  }

  const deleteProjectHandler = (id: number) => {
    deleteProject(id)

    closeDialog('confirm')
  }

  useEffect(() => {
    if (isDeleteSuccess) {
      enqueueSnackbar(t('notifications.delete_project.success'), {
        variant: 'success',
      })
    }

    if (isDeleteError) {
      enqueueSnackbar(t('notifications.delete_project.fail'), {
        variant: 'error',
      })
    }
  }, [isDeleteSuccess, isDeleteError, t])

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
            <ProjectCard
              key={project.id}
              item={project}
              actionsList={actions}
              onSelectActionHandler={selectActionHandler}
            />
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
      <ProjectFormDialog {...dialogs.projectForm} />
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
