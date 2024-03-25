import { DOMAttributes, MouseEvent, useId, useState } from 'react'
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { MoreHoriz, SvgIconComponent } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export type ActionItemKeys =
  | 'edit'
  | 'copy'
  | 'archive'
  | 'unarchive'
  | 'delete'

export type ActionItem = {
  key: ActionItemKeys
  icon: SvgIconComponent
}

interface ActionsDropdownProps extends DOMAttributes<HTMLDivElement> {
  actions: ActionItem[]
  onSelectHandler: (action: ActionItemKeys) => void
  ariaLabel?: string
}

export const ActionsDropdown = ({
  actions,
  onSelectHandler,
  ariaLabel,
  ...props
}: ActionsDropdownProps) => {
  const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null)
  const isDropdownOpened = Boolean(dropdownAnchor)
  const buttonId = useId()
  const dropdownId = useId()
  const { t } = useTranslation()

  const openDropdownHandler = (e: MouseEvent<HTMLButtonElement>) =>
    setDropdownAnchor(e.currentTarget)

  const closeDropdownHandler = () => setDropdownAnchor(null)

  return (
    <Box {...props}>
      <IconButton
        id={buttonId}
        aria-label={ariaLabel ? t(ariaLabel) : undefined}
        size="small"
        aria-haspopup="true"
        aria-controls={isDropdownOpened ? dropdownId : undefined}
        aria-expanded={isDropdownOpened ? 'true' : undefined}
        onClick={openDropdownHandler}
      >
        <MoreHoriz fontSize="small" />
      </IconButton>
      <Menu
        id={dropdownId}
        anchorEl={dropdownAnchor}
        open={isDropdownOpened}
        onClose={closeDropdownHandler}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
      >
        {actions.map((action) => {
          return (
            <MenuItem
              key={action.key}
              dense
              onClick={() => {
                onSelectHandler(action.key)
                closeDropdownHandler()
              }}
            >
              <ListItemIcon>
                <action.icon fontSize="small" />
              </ListItemIcon>
              {t(`actions.${action.key}`)}
            </MenuItem>
          )
        })}
      </Menu>
    </Box>
  )
}
