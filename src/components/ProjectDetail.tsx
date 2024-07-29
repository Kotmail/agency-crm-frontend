import { Box, styled, Typography } from '@mui/material'
import { IProject } from '../models/IProject'
import { TaskBoard } from './TaskBoard'

const ProjectHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 2,
  marginBottom: 30,
})

export const ProjectDetail = ({ project }: { project: IProject }) => {
  return (
    <>
      <ProjectHeader>
        <Typography component="h1" variant="h5" fontWeight="600">
          {project.name}
        </Typography>
      </ProjectHeader>
      <TaskBoard tasks={project.tasks!} />
    </>
  )
}
