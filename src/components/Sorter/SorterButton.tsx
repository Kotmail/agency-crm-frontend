import { Button, ButtonProps } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp, Sort } from '@mui/icons-material'

type SorterButton = {
  isOpened: boolean
} & ButtonProps

export const SorterButton = ({
  isOpened,
  children,
  ...props
}: SorterButton) => {
  return (
    <Button
      variant="text"
      size="small"
      sx={{
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
        textTransform: 'none',
        whiteSpace: 'nowrap',
        ':hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
        },
        '.MuiButton-startIcon': {
          marginLeft: '2px',
          marginRight: '4px',
        },
        '.MuiButton-endIcon': {
          marginLeft: '2px',
        },
      }}
      endIcon={isOpened ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      startIcon={<Sort />}
      {...props}
    >
      {children}
    </Button>
  )
}
