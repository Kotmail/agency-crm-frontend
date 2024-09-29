import { Box, Button, ButtonProps, styled } from '@mui/material'
import { TaskBoardData } from './TaskBoard'
import { useTranslation } from 'react-i18next'
import { TaskCard } from './TaskCard'
import { BoardStatusHeading } from './BoardStatusHeading'
import { blueGrey } from '@mui/material/colors'
import AddIcon from '@mui/icons-material/Add'

export const KanbanBoard = ({
  taskData: { statuses, groupedTasks },
  onAddTaskHandler,
}: TaskBoardData) => {
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
            <AddTaskButton onClick={() => onAddTaskHandler(status)}>
              {t('buttons.add_task')}
            </AddTaskButton>
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

const AddTaskButton = styled((props: ButtonProps) => (
  <Button variant="outlined" startIcon={<AddIcon />} {...props} />
))({
  width: '100%',
  padding: '7px 15px',
  border: `1px dashed ${blueGrey[200]}`,
  fontWeight: 400,
  lineHeight: 'normal',
  color: blueGrey[400],
  '& .MuiTouchRipple-root': {
    opacity: 0.5,
  },
  '&:hover': {
    border: `1px dashed ${blueGrey[300]}`,
    backgroundColor: blueGrey[50],
    color: blueGrey[500],
  },
})
