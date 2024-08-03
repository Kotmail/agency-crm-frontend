import { MouseEvent, useState } from 'react'
import { Box, styled, Tab, ToggleButtonGroup, Typography } from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import { TabContext, TabList } from '@mui/lab'
import MuiTabPanel from '@mui/lab/TabPanel'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import ViewListIcon from '@mui/icons-material/ViewList'
import { IProject } from '../models/IProject'
import { Link, matchRoutes, Outlet, useLocation } from 'react-router-dom'
import { TaskBoardView } from './TaskBoard'
import { useTranslation } from 'react-i18next'

const ProjectHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 2,
  marginBottom: 30,
})

const TabsHeading = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: 16,
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#fff',
})

const ToggleButton = styled(MuiToggleButton)({
  padding: 4,
  '.MuiSvgIcon-root': {
    width: 19,
    height: 19,
  },
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
  const { t } = useTranslation()

  const changeViewHandler = (_: MouseEvent<HTMLElement>, view: TaskBoardView) =>
    setView(view)

  return (
    <>
      <ProjectHeader>
        <Typography component="h1" variant="h5" fontWeight="600">
          {project.name}
        </Typography>
      </ProjectHeader>
      <TabContext value={currentTab}>
        <TabsHeading>
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
            <ToggleButton value="list" aria-label={t('aria_labels.list_view')}>
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </TabsHeading>
        {tabs.map((tab) => (
          <TabPanel key={tab.value} {...tab}>
            <Outlet context={{ project, view } satisfies ProjectTabsContext} />
          </TabPanel>
        ))}
      </TabContext>
    </>
  )
}
