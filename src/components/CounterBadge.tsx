import styled from '@emotion/styled'
import MuiBox, { BoxProps } from '@mui/material/Box'

const Box = styled((props: BoxProps) => <MuiBox {...props} />)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: '#dee3e9',
  fontWeight: 600,
  fontSize: 12,
})

export const CounterBadge = ({ value, ...props }: { value: number }) => {
  return <Box {...props}>{value || 0}</Box>
}
