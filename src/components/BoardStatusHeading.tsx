import {
  Box,
  BoxProps,
  styled,
  Typography,
  TypographyProps,
} from '@mui/material'
import { blue, green, grey, orange, red } from '@mui/material/colors'
import { HTMLAttributes } from 'react'

type BoardStatusHeadingProps = {
  label: string
  counterValue: number
} & HTMLAttributes<HTMLDivElement>

export const BoardStatusHeading = ({
  label,
  counterValue,
  ...props
}: BoardStatusHeadingProps) => {
  return (
    <Heading {...props}>
      <Label>{label}</Label>
      <Badge>{counterValue || 0}</Badge>
    </Heading>
  )
}

const Heading = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '&:not(:last-child)': {
    marginBottom: 10,
  },
  '&::before': {
    content: '""',
    width: 10,
    height: 10,
    marginRight: 8,
    borderRadius: '50%',
    backgroundColor: grey[500],
  },
  '&.unsorted::before': {
    backgroundColor: red[400],
  },
  '&.in_progress::before': {
    backgroundColor: blue[400],
  },
  '&.in_review::before': {
    backgroundColor: orange[400],
  },
  '&.completed::before': {
    backgroundColor: green[400],
  },
})

const Label = styled((props: TypographyProps) => (
  <Typography component="h2" {...props} />
))({
  paddingRight: 10,
  fontWeight: 500,
})

const Badge = styled((props: BoxProps) => <Box {...props} />)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 34,
  height: 24,
  borderRadius: 15,
  backgroundColor: '#dee3e9',
  fontWeight: 600,
  fontSize: 12,
})
