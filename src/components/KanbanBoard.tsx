import { Box, styled } from '@mui/material'
import { TaskBoardData } from './TaskBoard'
import { useTranslation } from 'react-i18next'
import { TaskCard } from './TaskCard'
import { BoardStatusHeading } from './BoardStatusHeading'

export const KanbanBoard = ({ statuses, groupedTasks }: TaskBoardData) => {
  const { t } = useTranslation()

  return (
    <Board>
      <Grid>
        {statuses.map((status) => (
          <Cell key={status}>
            <BoardStatusHeading
              label={t(`statuses.${status}`)}
              counterValue={groupedTasks[status]?.length}
              className={status}
            />
            {groupedTasks[status]?.length > 0 &&
              groupedTasks[status].map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </Cell>
        ))}
      </Grid>
    </Board>
  )
}

const Board = styled(Box)({
  overflowX: 'auto',
  marginLeft: -24,
  marginRight: -24,
  paddingLeft: 24,
  paddingRight: 24,
  '@media (width < 576px)': {
    marginLeft: -16,
    marginRight: -16,
    paddingLeft: 16,
    paddingRight: 16,
  },
})

const Grid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 20,
  width: 1152,
})

const Cell = styled(Box)({
  '.MuiPaper-root:not(:last-child)': {
    marginBottom: 20,
  },
})
