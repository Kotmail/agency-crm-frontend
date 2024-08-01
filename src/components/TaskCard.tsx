import {
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

const TaskWrapper = styled((props: PaperProps) => (
  <Paper variant="outlined" {...props} />
))({
  padding: 15,
})

const TaskName = styled((props: TypographyProps) => (
  <Typography component="h3" variant="subtitle2" {...props} />
))({
  '&:not(:last-child)': {
    marginBottom: 10,
  },
})

const TaskPriority = styled(PriorityChip)({
  '&:not(:last-child)': {
    marginBottom: 10,
  },
})

const TaskUsers = styled(AvatarGroup)({
  paddingTop: 5,
  width: 'max-content',
})

export const TaskCard = ({ task }: { task: ITask }) => {
  return (
    <TaskWrapper>
      <TaskName>
        <Link
          component={RouterLink}
          to={`${task.id}`}
          underline="none"
          color="inherit"
        >
          {task.name}
        </Link>
      </TaskName>
      <TaskPriority priority={task.priority} />
      <TaskUsers users={task.responsibleUsers} />
    </TaskWrapper>
  )
}
