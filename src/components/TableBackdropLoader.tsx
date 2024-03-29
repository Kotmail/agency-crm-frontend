import { Backdrop, BackdropProps, CircularProgress } from '@mui/material'

export const TableBackdropLoader = ({ open }: BackdropProps) => {
  return (
    <Backdrop
      sx={{
        position: 'absolute',
        backgroundColor: 'rgb(255 255 255 / 70%)',
        zIndex: 3,
      }}
      open={open}
      transitionDuration={600}
    >
      <CircularProgress />
    </Backdrop>
  )
}
