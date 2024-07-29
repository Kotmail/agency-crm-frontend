import { ITask } from '../models/ITask'
import styled from '@emotion/styled'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { Box, Typography } from '@mui/material'
import { AvatarGroup } from './AvatarGroup'
import { PriorityChip } from './PriorityChip'

const TaskWrapper = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  gridTemplateAreas: `"heading heading"
                      "avatars priority"`,
  alignItems: 'center',
  gap: '6px 5px',
  padding: '10px 15px',
  backgroundColor: '#fff',
  '.MuiTypography-subtitle2': {
    gridArea: 'heading',
  },
  '.MuiChip-root': {
    gridArea: 'priority',
    justifySelf: 'flex-start',
  },
  '.MuiAvatarGroup-root': {
    gridArea: 'avatars',
  },
  '@media (width >= 768px)': {
    gridTemplateAreas: '"heading priority avatars"',
    gridTemplateColumns: 'max-content max-content 1fr',
    gap: '6px 10px',
    '.MuiAvatarGroup-root': {
      marginLeft: 0,
      marginRight: -2,
    },
  },
})

export const TaskRow = ({ task }: { task: ITask }) => {
  return (
    <TaskWrapper>
      <Typography component="h2" variant="subtitle2">
        <Link
          component={RouterLink}
          to={`${task.id}`}
          underline="none"
          color="inherit"
        >
          {task.name}
        </Link>
      </Typography>
      <PriorityChip priority={task.priority} />
      <AvatarGroup users={task.responsibleUsers} />
    </TaskWrapper>
  )
}
