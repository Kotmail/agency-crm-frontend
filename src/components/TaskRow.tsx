import { ITask } from '../models/ITask'
import styled from '@emotion/styled'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { Box, Typography } from '@mui/material'
import { AvatarGroup } from './AvatarGroup'
import { PriorityChip } from './PriorityChip'
import { DeadlineProperty } from './DeadlineProperty'

export const TaskRow = ({ task }: { task: ITask }) => {
  return (
    <Row>
      <Typography component="h3" variant="subtitle2">
        <Link
          component={RouterLink}
          to={`${task.id}`}
          underline="none"
          color="inherit"
        >
          {task.name}
        </Link>
      </Typography>
      <Properties>
        <PriorityChip priority={task.priority} />
        <DeadlineProperty date={task.dueDate} />
      </Properties>
      <Users users={task.responsibleUsers} />
    </Row>
  )
}

const Row = styled(Box)({
  padding: '8px 15px',
  backgroundColor: '#fff',
  '@media (width >= 768px)': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
    '.MuiAvatarGroup-root': {
      marginLeft: 0,
      marginRight: -2,
    },
  },
})

const Properties = styled(Box)({
  display: 'flex',
  gap: 10,
  marginRight: 'auto',
  '@media (width < 768px)': {
    marginBottom: 2,
    '&:not(:last-child)': {
      marginBottom: 10,
    },
    paddingTop: 10,
  },
})

const Users = styled(AvatarGroup)({
  width: 'max-content',
  '.MuiAvatar-root': {
    width: 26,
    height: 26,
  },
})
