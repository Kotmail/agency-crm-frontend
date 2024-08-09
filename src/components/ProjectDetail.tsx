import { MouseEvent, useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  IconButtonProps,
  Paper,
  styled,
  Tab,
  ToggleButtonGroup,
  Typography,
  TypographyProps,
} from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import { TabContext, TabList } from '@mui/lab'
import MuiTabPanel from '@mui/lab/TabPanel'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import ViewListIcon from '@mui/icons-material/ViewList'
import { IProject } from '../models/IProject'
import { Link, matchRoutes, Outlet, useLocation } from 'react-router-dom'
import { TaskBoardView } from './TaskBoard'
import { useTranslation } from 'react-i18next'
import { AvatarGroup } from './AvatarGroup'
import { formatDate } from '../utils/helpers/formatDate'
import { PriorityChip } from './PriorityChip'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AddIcon from '@mui/icons-material/Add'
import { TaskFormDialog, TaskFormDialogProps } from './dialogs/TaskFormDialog'
import { useDialogs } from '../hooks/useDialogs'
import {
  ProjectFormDialog,
  ProjectFormDialogProps,
} from './dialogs/ProjectFormDialog'
import { DIALOG_BASE_OPTIONS } from '../utils/consts'

const Header = styled(Paper)({
  position: 'relative',
  padding: '15px 15px 0',
})

const HeadingLine = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '12px',
  '@media (width < 576px)': {
    gap: '6px',
    paddingRight: '35px',
  },
})

const Title = styled((props: TypographyProps) => (
  <Typography component="h1" variant="h5" {...props} />
))({
  fontWeight: 600,
  '@media (width < 768px)': {
    fontSize: '1.375rem',
  },
  '@media (width < 576px)': {
    fontSize: '1.125rem',
  },
})

const EditBtn = styled((props: IconButtonProps) => (
  <IconButton size="small" children={<EditOutlinedIcon />} {...props} />
))({
  '.MuiSvgIcon-root': {
    fontSize: '1.33rem',
  },
  '@media (width < 576px)': {
    position: 'absolute',
    top: 11,
    right: 10,
    '.MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  },
})

const MetaLine = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  '@media (width >= 576px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

const Properties = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3px 10px',
})

const TabsLine = styled(Box)({
  margin: '15px -15px 0',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  '@media (width >= 768px)': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

const ButtonGroup = styled(Box)({
  display: 'flex',
  paddingLeft: 15,
  paddingRight: 15,
  gap: 12,
  '@media (width < 768px)': {
    paddingTop: 12,
    paddingBottom: 12,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  },
})

const Avatars = styled(AvatarGroup)({
  width: 'max-content',
  '.MuiAvatar-root': {
    width: 28,
    height: 28,
  },
})

const ToggleButton = styled(MuiToggleButton)({
  padding: '1px 2px',
})

const TabPanel = styled(MuiTabPanel)({
  padding: '30px 0 0',
})

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

type DialogVariants = {
  projectForm: ProjectFormDialogProps
  taskForm: TaskFormDialogProps
}

export type ProjectTabsContext = {
  project: IProject
  view: TaskBoardView
}

export const ProjectDetail = ({ project }: { project: IProject }) => {
  const location = useLocation()
  const match = matchRoutes(
    tabs.map((tab) => ({ path: tab.value })),
    location,
  )
  const currentTab = match?.pop()?.route.path || tabs[1].value
  const [view, setView] = useState<TaskBoardView>('kanban')
  const [dialogs, openDialog] = useDialogs<DialogVariants>({
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
        <Header>
          <HeadingLine>
            <Title>{project.name}</Title>
            <PriorityChip priority={project.priority} />
            <EditBtn
              aria-label={t('aria_labels.edit')}
              onClick={() =>
                openDialog('projectForm', {
                  ...DIALOG_BASE_OPTIONS.form.editProject,
                  project,
                })
              }
            />
          </HeadingLine>
          <MetaLine>
            <Properties>
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
            </Properties>
            <Avatars users={project.members} />
          </MetaLine>
          <TabsLine>
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
              <ButtonGroup>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => openDialog('taskForm')}
                >
                  {t('buttons.new_task')}
                </Button>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  size="small"
                  onChange={changeViewHandler}
                >
                  <ToggleButton
                    value="kanban"
                    aria-label={t('aria_labels.kanban_view')}
                  >
                    <ViewKanbanIcon />
                  </ToggleButton>
                  <ToggleButton
                    value="list"
                    aria-label={t('aria_labels.list_view')}
                  >
                    <ViewListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </ButtonGroup>
            )}
          </TabsLine>
        </Header>
        {tabs.map((tab) => (
          <TabPanel key={tab.value} {...tab}>
            <Outlet context={{ project, view } satisfies ProjectTabsContext} />
          </TabPanel>
        ))}
      </TabContext>
      <ProjectFormDialog {...dialogs.projectForm} />
      <TaskFormDialog {...dialogs.taskForm} />
    </>
  )
}
