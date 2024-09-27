import {
  Box,
  Link,
  Paper,
  PaperProps,
  styled,
  Typography,
  TypographyProps,
} from '@mui/material'
import { ITask } from '../models/ITask'
import { Link as RouterLink } from 'react-router-dom'
import { AvatarGroup } from './AvatarGroup'
import { PriorityChip } from './PriorityChip'
import grey from '@mui/material/colors/grey'
import { DeadlineProperty } from './DeadlineProperty'

export const TaskCard = ({ task }: { task: ITask }) => {
  return (
    <Card>
      <Name>
        <Link
          component={RouterLink}
          to={`${task.id}`}
          underline="none"
          color="inherit"
        >
          {task.name}
        </Link>
      </Name>
      {task.description && <Description>{task.description}</Description>}
      <Properties>
        <PriorityChip priority={task.priority} />
        <DeadlineProperty date={task.dueDate} />
      </Properties>
      <Users users={task.responsibleUsers} />
    </Card>
  )
}

const Card = styled((props: PaperProps) => (
  <Paper variant="outlined" {...props} />
))({
  padding: 15,
})

const Name = styled((props: TypographyProps) => (
  <Typography component="h3" variant="subtitle2" {...props} />
))({
  marginBottom: 10,
})

const Description = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  marginBottom: 12,
  overflow: 'hidden',
  fontSize: 13,
  color: grey[600],
})

const Properties = styled(Box)({
  display: 'flex',
  gap: 10,
  '&:not(:last-child)': {
    marginBottom: 15,
  },
})

const Users = styled(AvatarGroup)({
  width: 'max-content',
  '.MuiAvatar-root': {
    width: 26,
    height: 26,
  },
})
