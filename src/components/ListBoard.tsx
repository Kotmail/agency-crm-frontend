import { styled, Typography, TypographyProps } from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TaskRow } from './TaskRow'
import { useTranslation } from 'react-i18next'
import { TaskBoardData } from './TaskBoard'
import { CounterBadge } from './CounterBadge'

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

const StatusName = styled((props: TypographyProps) => (
  <Typography component="h2" {...props} />
))({
  paddingRight: 10,
  fontWeight: 500,
})

export const ListBoard = ({ groups, groupedTasks }: TaskBoardData) => {
  const { t } = useTranslation()

  return groups.map((group) => (
    <Board key={group}>
      <Summary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${group}-content`}
        id={`${group}-header`}
      >
        <StatusName>{t(`statuses.${group}`)}</StatusName>
        <CounterBadge value={groupedTasks[group]?.length} />
      </Summary>
      <Tasks>
        {groupedTasks[group]?.length > 0 &&
          groupedTasks[group].map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
      </Tasks>
    </Board>
  ))
}
