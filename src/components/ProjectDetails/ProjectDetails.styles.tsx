import {
  Box,
  IconButton,
  IconButtonProps,
  Paper,
  styled,
  Typography,
  TypographyProps,
} from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import MuiTabPanel from '@mui/lab/TabPanel'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { AvatarGroup } from '../AvatarGroup'

export const Header = styled(Paper)({
  position: 'relative',
  padding: '15px 15px 0',
})

export const HeadingLine = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '12px',
  '@media (width < 576px)': {
    gap: '6px',
    paddingRight: '35px',
  },
})

export const Title = styled((props: TypographyProps) => (
  <Typography component="h1" variant="h5" {...props} />
))({
  fontWeight: 600,
  '@media (width < 768px)': {
    fontSize: '1.375rem',
  },
  '@media (width < 576px)': {
    fontSize: '1.125rem',
  },
})

export const EditBtn = styled((props: IconButtonProps) => (
  <IconButton size="small" children={<EditOutlinedIcon />} {...props} />
))({
  '.MuiSvgIcon-root': {
    fontSize: '1.33rem',
  },
  '@media (width < 576px)': {
    position: 'absolute',
    top: 11,
    right: 10,
    '.MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  },
})

export const MetaLine = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  '@media (width >= 576px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export const Properties = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3px 10px',
})

export const TabsLine = styled(Box)({
  margin: '15px -15px 0',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  '@media (width >= 768px)': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export const ButtonGroup = styled(Box)({
  display: 'flex',
  paddingLeft: 15,
  paddingRight: 15,
  gap: 12,
  '@media (width < 768px)': {
    paddingTop: 12,
    paddingBottom: 12,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  },
})

export const Avatars = styled(AvatarGroup)({
  width: 'max-content',
  '.MuiAvatar-root': {
    width: 28,
    height: 28,
  },
})

export const ToggleButton = styled(MuiToggleButton)({
  padding: '1px 2px',
})

export const TabPanel = styled(MuiTabPanel)({
  padding: '30px 0 0',
})
