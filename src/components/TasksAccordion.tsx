import { Dictionary } from 'lodash'
import { ITask } from '../models/ITask'
import { Box, styled } from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TaskRow } from './TaskRow'
import { useTranslation } from 'react-i18next'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters defaultExpanded square {...props} />
))({
  boxShadow: 'unset',
  backgroundColor: 'unset',
  '&::before': {
    display: 'none',
  },
})

const AccordionSummary = styled(MuiAccordionSummary)({
  padding: '0 15px',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#f3f5f7',
  '& .MuiAccordionSummary-content': {
    margin: 0,
    fontWeight: 500,
  },
})

const CounterBadge = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 24,
  height: 24,
  marginLeft: '10px',
  borderRadius: '50%',
  backgroundColor: '#dee3e9',
  fontWeight: 600,
  fontSize: 12,
})

const AccordionDetails = styled(MuiAccordionDetails)({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  '& > .MuiBox-root:not(:last-child)': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
})

export const TasksAccordion = ({ tasks }: { tasks: Dictionary<ITask[]> }) => {
  const { t } = useTranslation()

  return Object.entries(tasks).map(([status, tasks]) => (
    <Accordion key={status}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${status}-content`}
        id={`${status}-header`}
      >
        {t(`task_board.group_labels.${status}`)}
        <CounterBadge>{tasks.length}</CounterBadge>
      </AccordionSummary>
      <AccordionDetails>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </AccordionDetails>
    </Accordion>
  ))
}
