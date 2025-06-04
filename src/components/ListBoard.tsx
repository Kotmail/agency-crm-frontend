import { Button, ButtonProps, styled } from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TaskRow } from './TaskRow'
import { useTranslation } from 'react-i18next'
import { TaskBoardData } from './TaskBoard'
import { BoardStatusHeading } from './BoardStatusHeading'
import { blueGrey } from '@mui/material/colors'
import AddIcon from '@mui/icons-material/Add'

export const ListBoard = ({
  taskData: { statuses, groupedTasks },
  onAddTaskHandler,
}: TaskBoardData) => {
  const { t } = useTranslation()

  return statuses.map((status) => (
    <Board key={status}>
      <Summary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${status}-content`}
        id={`${status}-header`}
      >
        <BoardStatusHeading
          label={t(`statuses.${status}`)}
          counterValue={groupedTasks[status]?.length}
          className={status}
        />
      </Summary>
      <Tasks>
        {groupedTasks[status]?.length > 0 &&
          groupedTasks[status].map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        <AddTaskButton onClick={() => onAddTaskHandler(status)}>
          {t('buttons.add_task')}
        </AddTaskButton>
      </Tasks>
    </Board>
  ))
}

const Board = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters defaultExpanded square {...props} />
))({
  border: 'unset',
  boxShadow: 'unset',
  backgroundColor: 'unset',
  '&::before': {
    display: 'none',
  },
  '&:first-of-type .MuiAccordionSummary-root': {
    paddingTop: 0,
    borderTop: 'none',
  },
})

const Summary = styled(MuiAccordionSummary)({
  minHeight: 'auto',
  padding: '10px 0',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#f3f5f7',
  '& .MuiAccordionSummary-content': {
    alignItems: 'center',
    margin: 0,
    fontWeight: 500,
  },
})

const Tasks = styled(MuiAccordionDetails)({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  '& > .MuiBox-root:not(:last-child)': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  backgroundColor: '#fff',
})

const AddTaskButton = styled((props: ButtonProps) => (
  <Button variant="text" startIcon={<AddIcon />} {...props} />
))({
  borderRadius: 0,
  padding: '10px 15px',
  fontWeight: 400,
  lineHeight: 'normal',
  color: blueGrey[400],
  '& .MuiTouchRipple-root': {
    opacity: 0.5,
  },
  '&:hover': {
    backgroundColor: 'unset',
    color: blueGrey[600],
  },
})
