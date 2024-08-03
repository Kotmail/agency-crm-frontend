import { styled } from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TaskRow } from './TaskRow'
import { useTranslation } from 'react-i18next'
import { TaskBoardData } from './TaskBoard'
import { CounterBadge } from './CounterBadge'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters defaultExpanded square {...props} />
))({
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

const AccordionSummary = styled(MuiAccordionSummary)({
  minHeight: 'auto',
  padding: '12px 15px',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#f3f5f7',
  '& .MuiAccordionSummary-content': {
    margin: 0,
    fontWeight: 500,
  },
})

const Counter = styled(CounterBadge)({
  marginLeft: 10,
})

const AccordionDetails = styled(MuiAccordionDetails)({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  '& > .MuiBox-root:not(:last-child)': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
})

export const ListBoard = ({ groups, groupedTasks }: TaskBoardData) => {
  const { t } = useTranslation()

  return groups.map((group) => (
    <Accordion key={group}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${group}-content`}
        id={`${group}-header`}
      >
        {t(`task_board.group_labels.${group}`)}
        <Counter value={groupedTasks[group]?.length} />
      </AccordionSummary>
      <AccordionDetails>
        {groupedTasks[group]?.length > 0 &&
          groupedTasks[group].map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
      </AccordionDetails>
    </Accordion>
  ))
}
