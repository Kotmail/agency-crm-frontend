import { MouseEvent, useState } from 'react'
import { Button, Tab, ToggleButtonGroup, Typography } from '@mui/material'
import { TabContext, TabList } from '@mui/lab'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import ViewListIcon from '@mui/icons-material/ViewList'
import { IProject } from '../../models/IProject'
import { Link, matchRoutes, Outlet, useLocation } from 'react-router-dom'
import { TaskBoardView } from '../TaskBoard'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../utils/helpers/formatDate'
import { PriorityChip } from '../PriorityChip'
import AddIcon from '@mui/icons-material/Add'
import { useDialogs } from '../../hooks/useDialogs'
import {
  ProjectFormDialog,
  ProjectFormDialogProps,
} from '../dialogs/ProjectFormDialog'
import { DIALOG_BASE_OPTIONS } from '../../utils/consts'
import * as S from './ProjectDetails.styles'
import { TaskFormDialog, TaskFormDialogProps } from '../dialogs/TaskFormDialog'

const tabs = [
  {
    label: 'tabs.about_project',
    to: '',
    value: 'projects/:id',
  },
  {
    label: 'tabs.tasks',
    to: 'tasks',
    value: 'projects/:id/tasks',
  },
]

type Dialogs = {
  projectForm: ProjectFormDialogProps
  taskForm: TaskFormDialogProps
}

export type ProjectTabsContext = {
  project: IProject
  view: TaskBoardView
}

export const ProjectDetails = ({ project }: { project: IProject }) => {
  const location = useLocation()
  const match = matchRoutes(
    tabs.map((tab) => ({ path: tab.value })),
    location,
  )
  const currentTab = match?.pop()?.route.path || tabs[1].value
  const [view, setView] = useState<TaskBoardView>('kanban')
  const [dialogs, openDialog] = useDialogs<Dialogs>({
    projectForm: {
      open: false,
    },
    taskForm: {
      open: false,
      project,
    },
  })
  const { t } = useTranslation()

  const changeViewHandler = (_: MouseEvent<HTMLElement>, view: TaskBoardView) =>
    setView(view)

  return (
    <>
      <TabContext value={currentTab}>
        <S.Header>
          <S.HeadingLine>
            <S.Title>{project.name}</S.Title>
            <PriorityChip priority={project.priority} />
            <S.EditBtn
              aria-label={t('aria_labels.edit')}
              onClick={() =>
                openDialog('projectForm', {
                  ...DIALOG_BASE_OPTIONS.form.editProject,
                  project,
                })
              }
            />
          </S.HeadingLine>
          <S.MetaLine>
            <S.Properties>
              <Typography
                component="div"
                fontSize="14px"
                sx={{ color: '#4a4a4a' }}
              >
                <Typography component="span" fontWeight="500" fontSize="14px">
                  {t('project.labels.created_at')}
                </Typography>
                &nbsp;
                {formatDate(project.createdAt)}
              </Typography>
              <Typography
                component="div"
                fontSize="14px"
                sx={{ color: '#4a4a4a' }}
              >
                <Typography component="span" fontWeight="500" fontSize="14px">
                  {t('project.labels.due_date')}
                </Typography>
                &nbsp;
                {(project.dueDate && formatDate(project.dueDate)) ||
                  t('project.no_due_date')}
              </Typography>
            </S.Properties>
            <S.Avatars users={project.members} />
          </S.MetaLine>
          <S.TabsLine>
            <TabList aria-label={t('aria_labels.project_tablist')}>
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  {...tab}
                  label={t(tab.label)}
                  component={Link}
                />
              ))}
            </TabList>
            {currentTab === tabs[1].value && (
              <S.ButtonGroup>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    openDialog('taskForm', {
                      ...DIALOG_BASE_OPTIONS.form.addTask,
                      project,
                    })
                  }
                >
                  {t('buttons.new_task')}
                </Button>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  size="small"
                  onChange={changeViewHandler}
                >
                  <S.ToggleButton
                    value="kanban"
                    aria-label={t('aria_labels.kanban_view')}
                  >
                    <ViewKanbanIcon />
                  </S.ToggleButton>
                  <S.ToggleButton
                    value="list"
                    aria-label={t('aria_labels.list_view')}
                  >
                    <ViewListIcon />
                  </S.ToggleButton>
                </ToggleButtonGroup>
              </S.ButtonGroup>
            )}
          </S.TabsLine>
        </S.Header>
        {tabs.map((tab) => (
          <S.TabPanel key={tab.value} {...tab}>
            <Outlet context={{ project, view } satisfies ProjectTabsContext} />
          </S.TabPanel>
        ))}
      </TabContext>
      <ProjectFormDialog {...dialogs.projectForm} />
      <TaskFormDialog {...dialogs.taskForm} />
    </>
  )
}
