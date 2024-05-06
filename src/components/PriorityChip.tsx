import { Chip } from '@mui/material'
import { lightBlue, orange, teal } from '@mui/material/colors'
import { OrderPriority } from '../models/IOrder'
import { useTranslation } from 'react-i18next'

const priorityColors = {
  low: {
    borderColor: teal[300],
    color: teal[400],
  },
  medium: {
    borderColor: lightBlue[400],
    color: lightBlue[600],
  },
  high: {
    borderColor: orange[800],
    color: orange[900],
  },
}

type PriorityChipProps = {
  priority: OrderPriority
}

export const PriorityChip = ({ priority }: PriorityChipProps) => {
  const { t } = useTranslation()

  return (
    <Chip
      variant="outlined"
      label={t(`order_priorities.${priority}`)}
      sx={{
        minWidth: '83px',
        borderWidth: '2px',
        borderRadius: '4px',
        fontWeight: 500,
        ...priorityColors[priority],
      }}
    />
  )
}
