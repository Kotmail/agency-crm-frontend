import { styled } from '@mui/material'
import MuiChip, { ChipProps } from '@mui/material/Chip'
import { useTranslation } from 'react-i18next'
import { Priority } from '../models/IProject'
import { blue, orange, red } from '@mui/material/colors'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

const priorityChipColors: Record<Priority, ChipProps['color']> = {
  [Priority.LOW]: 'primary',
  [Priority.MEDIUM]: 'warning',
  [Priority.HIGH]: 'error',
}

export const PriorityChip = ({
  priority,
  ...props
}: {
  priority: Priority | null
}) => {
  const { t } = useTranslation()

  if (!priority) {
    return null
  }

  return (
    <Chip
      label={t(`priorities.${priority}`)}
      color={priorityChipColors[priority]}
      {...props}
    />
  )
}

const Chip = styled((props: ChipProps) => (
  <MuiChip icon={<LocalFireDepartmentIcon />} size="small" {...props} />
))(({ color }) => ({
  height: 26,
  borderRadius: 4,
  fontWeight: 600,
  fontSize: 12,
  backgroundColor:
    color === 'error'
      ? red[100]
      : color === 'warning'
      ? orange[100]
      : blue[100],
  color:
    color === 'error'
      ? red[400]
      : color === 'warning'
      ? orange[800]
      : blue[800],
  '.MuiChip-label': {
    padding: '0 8px',
  },
}))
