import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'

type CreateEntityButtonProps = {
  text: string
  onClick: () => void
}

export const CreateEntityButton = ({
  text,
  ...props
}: CreateEntityButtonProps) => {
  const theme = useTheme()
  const matchSmBreakpoint = useMediaQuery(theme.breakpoints.up('sm'))
  const { t } = useTranslation()

  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      sx={{
        minWidth: 'auto',
        '.MuiButton-startIcon': {
          margin: matchSmBreakpoint ? '0 8px 0 -4px' : 0,
        },
        '.label': {
          display: matchSmBreakpoint ? 'inline' : 'none',
        },
      }}
      {...props}
    >
      <Box component="span" className="label">
        {t(text)}
      </Box>
    </Button>
  )
}
