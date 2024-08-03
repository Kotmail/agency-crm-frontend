import { Box, styled, Typography, TypographyProps } from '@mui/material'
import { TaskBoardData } from './TaskBoard'
import { useTranslation } from 'react-i18next'
import { TaskCard } from './TaskCard'
import { CounterBadge } from './CounterBadge'

const Wrapper = styled(Box)({
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

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '&:not(:last-child)': {
    marginBottom: 10,
  },
})

const Label = styled((props: TypographyProps) => (
  <Typography component="h2" {...props} />
))({
  paddingRight: 10,
  fontWeight: 500,
})

export const KanbanBoard = ({ groups, groupedTasks }: TaskBoardData) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Grid>
        {groups.map((group) => (
          <Cell key={group}>
            <Header>
              <Label>{t(`task_board.group_labels.${group}`)}</Label>
              <CounterBadge value={groupedTasks[group]?.length} />
            </Header>
            {groupedTasks[group]?.length > 0 &&
              groupedTasks[group].map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </Cell>
        ))}
      </Grid>
    </Wrapper>
  )
}
