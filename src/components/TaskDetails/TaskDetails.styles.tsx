import styled from '@emotion/styled'
import {
  Box,
  IconButton,
  IconButtonProps,
  Typography,
  TypographyProps,
} from '@mui/material'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import CloseIcon from '@mui/icons-material/Close'
import { grey } from '@mui/material/colors'
import { UserAvatar } from '../UserAvatar'

export const Drawer = styled((props: DrawerProps) => (
  <MuiDrawer
    anchor="right"
    PaperProps={{
      sx: {
        width: '100%',
        maxWidth: 460,
        border: 'unset',
        boxSizing: 'border-box',
      },
    }}
    {...props}
  />
))()

export const Crumbs = styled(Typography)({
  fontSize: 14,
  color: grey[600],
})

export const TopLine = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '5px 15px',
  borderBottom: `1px solid ${grey[300]}`,
  '@media (width >= 576px)': {
    padding: '5px 20px',
  },
})

export const Buttons = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  marginRight: -10,
})

export const CloseButton = styled((props: IconButtonProps) => (
  <IconButton size="small" {...props}>
    <CloseIcon fontSize="small" />
  </IconButton>
))({})

export const Content = styled(Box)({
  padding: 15,
  '@media (width >= 576px)': {
    padding: '15px 20px',
  },
})

export const Heading = styled((props: TypographyProps) => (
  <Typography component="h1" {...props} variant="h5" />
))({
  marginBottom: 15,
  fontWeight: 600,
  fontSize: 21,
  '@media (width >= 576px)': {
    fontSize: 23,
  },
})

export const Description = styled(Typography)({
  marginBottom: 25,
  lineHeight: 1.3,
  color: grey[800],
})

export const Properties = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px 20px',
})

export const Property = styled(Box)({
  '.MuiTypography-root': {
    fontSize: 14,
  },
})

export const PropertyLabel = styled((props: TypographyProps) => (
  <Typography component="div" {...props} />
))({
  marginBottom: 6,
  fontSize: 'inherit',
  color: grey[600],
})

export const Avatars = styled(Box)({
  display: 'flex',
  gap: '10px',
  marginTop: '12px',
  flexWrap: 'wrap',
  paddingTop: '12px',
  borderTop: `1px solid ${grey[300]}`,
})

export const Avatar = styled(UserAvatar)({
  width: 33,
  height: 33,
})
