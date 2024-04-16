import { IconButton, IconButtonProps, Tooltip } from '@mui/material'
import { Tune } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export const FilterButton = ({ ...props }: IconButtonProps) => {
  const { t } = useTranslation()

  return (
    <Tooltip title={t('filter.tooltip')}>
      <IconButton
        size="small"
        color="primary"
        sx={{
          borderRadius: '4px',
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          ':hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            borderRadius: '4px',
          },
        }}
        {...props}
      >
        <Tune sx={{ fontSize: '19px' }} />
      </IconButton>
    </Tooltip>
  )
}
