import { Backdrop, BackdropProps, CircularProgress } from '@mui/material'

export const TableBackdropLoader = ({ open }: BackdropProps) => {
  return (
    <Backdrop
      sx={{
        position: 'absolute',
        backgroundColor: 'rgb(255 255 255 / 70%)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
      transitionDuration={600}
    >
      <CircularProgress />
    </Backdrop>
  )
}
