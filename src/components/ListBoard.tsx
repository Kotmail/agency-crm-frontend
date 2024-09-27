import { styled } from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TaskRow } from './TaskRow'
import { useTranslation } from 'react-i18next'
import { TaskBoardData } from './TaskBoard'
import { BoardStatusHeading } from './BoardStatusHeading'

export const ListBoard = ({ statuses, groupedTasks }: TaskBoardData) => {
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
})
