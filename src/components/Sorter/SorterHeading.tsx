import { Typography, TypographyProps } from '@mui/material'

export const SorterHeading = ({ children, ...props }: TypographyProps) => {
  return (
    <Typography
      fontWeight={500}
      fontSize="14px"
      component="div"
      color="#000"
      padding="8px 16px 0"
      {...props}
    >
      {children}
    </Typography>
  )
}
