import { Chip, ChipProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Priority } from '../models/IProject'

type ChipColorsType = {
  [key in Priority]: ChipProps['color']
}

const chipColors: ChipColorsType = {
  [Priority.LOW]: 'primary',
  [Priority.MEDIUM]: 'warning',
  [Priority.HIGH]: 'error',
}

export const PriorityChip = ({ priority }: { priority: Priority }) => {
  const { t } = useTranslation()

  return (
    <Chip color={chipColors[priority]} label={t(`priorities.${priority}`)} />
  )
}
