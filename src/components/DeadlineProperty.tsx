import { styled, Typography } from '@mui/material'
import blueGrey from '@mui/material/colors/blueGrey'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { formatDate } from '../utils/helpers/formatDate'
import { useTranslation } from 'react-i18next'

export const DeadlineProperty = ({ date, ...props }: { date: Date | null }) => {
  const { t } = useTranslation()

  return (
    <Deadline {...props}>
      <AccessTimeIcon fontSize="small" />
      {date ? formatDate(date) : t('task.no_due_date')}
    </Deadline>
  )
}

const Deadline = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontWeight: 500,
  fontSize: 12,
  color: blueGrey[600],
})
