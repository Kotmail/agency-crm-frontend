import { useTranslation } from 'react-i18next'
import { SortOption } from '.'
import { ListItemIcon, MenuItem, MenuItemProps } from '@mui/material'

type SorterItemProps = {
  option: SortOption
} & MenuItemProps

export const SorterItem = ({ option, ...props }: SorterItemProps) => {
  const { t } = useTranslation()

  return (
    <MenuItem {...props}>
      {t(option.label)}
      {option.icon && (
        <ListItemIcon>
          <option.icon
            fontSize="small"
            sx={{
              marginLeft: '6px',
              transform: option.key === 'ASC' ? 'rotate(-180deg)' : '',
            }}
          />
        </ListItemIcon>
      )}
    </MenuItem>
  )
}
