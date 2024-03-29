import { MouseEvent, useEffect, useId, useState } from 'react'
import {
  Box,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from '@mui/material'
import { FilterList, SvgIconComponent, Sort } from '@mui/icons-material'
import { SorterHeading } from './SorterHeading'
import { useTranslation } from 'react-i18next'

export type SortByFieldValues = 'createdAt' | 'deadline' | 'cost'
export type OrderByFieldValues = 'asc' | 'desc'

export type SortData = {
  sortby: SortByFieldValues
  orderby: OrderByFieldValues
}

export type SortOption = {
  key: SortByFieldValues | OrderByFieldValues
  label: string
  icon?: SvgIconComponent
}

type SorterProps = {
  sortByOptions: SortOption[]
  initialData: SortData
  onSortHandler: (sortData: SortData) => void
}

const orderByOptions: SortOption[] = [
  {
    key: 'asc',
    label: 'sorter.options.asc',
    icon: FilterList,
  },
  {
    key: 'desc',
    label: 'sorter.options.desc',
    icon: FilterList,
  },
]

export const Sorter = ({
  sortByOptions,
  initialData,
  onSortHandler,
}: SorterProps) => {
  const [sortData, setSortData] = useState(initialData)
  const [popperAnchor, setAnchorPopper] = useState<null | HTMLButtonElement>(
    null,
  )
  const popperId = useId()
  const { t } = useTranslation()

  useEffect(() => {
    onSortHandler(sortData)
  }, [sortData, onSortHandler])

  const openPopperHandler = (e: MouseEvent<HTMLButtonElement>) =>
    setAnchorPopper(e.currentTarget)

  const closePopperHandler = () => setAnchorPopper(null)

  const onSelectItemHandler = (option: SortOption, sortField: keyof SortData) =>
    setSortData((sortData) => ({ ...sortData, [sortField]: option.key }))

  return (
    <>
      <Tooltip title={t('sorter.tooltip')}>
        <IconButton
          aria-describedby={popperId}
          color="primary"
          sx={{
            padding: '5px',
            border: '1px solid',
            borderRadius: '4px',
            '.MuiTouchRipple-root .MuiTouchRipple-child': {
              borderRadius: '4px',
            },
          }}
          onClick={openPopperHandler}
        >
          <Sort />
        </IconButton>
      </Tooltip>
      <Popper
        id={popperId}
        open={Boolean(popperAnchor)}
        anchorEl={popperAnchor}
        placement="top-end"
        transition
        sx={{
          zIndex: 5,
        }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'right top',
              minWidth: 250,
              marginTop: 10,
            }}
          >
            <Paper elevation={6}>
              <ClickAwayListener onClickAway={closePopperHandler}>
                <Box>
                  <SorterHeading>{t('sorter.sortby_label')}</SorterHeading>
                  <MenuList>
                    {sortByOptions.map((option) => (
                      <MenuItem
                        key={option.key}
                        dense
                        disabled={option.key === sortData.sortby}
                        selected={option.key === sortData.sortby}
                        onClick={() => onSelectItemHandler(option, 'sortby')}
                        sx={{
                          '&.Mui-disabled': { opacity: 1 },
                        }}
                      >
                        {t(option.label)}
                      </MenuItem>
                    ))}
                  </MenuList>
                  <Divider variant="middle" />
                  <SorterHeading>{t('sorter.orderby_label')}</SorterHeading>
                  <MenuList>
                    {orderByOptions.map((option) => (
                      <MenuItem
                        key={option.key}
                        dense
                        disabled={option.key === sortData.orderby}
                        selected={option.key === sortData.orderby}
                        onClick={() => onSelectItemHandler(option, 'orderby')}
                        sx={{
                          '&.Mui-disabled': { opacity: 1 },
                        }}
                      >
                        {t(option.label)}
                        {option.icon && (
                          <ListItemIcon>
                            <option.icon
                              fontSize="small"
                              sx={{
                                marginLeft: '6px',
                                transform:
                                  option.key === 'asc' ? 'rotate(-180deg)' : '',
                              }}
                            />
                          </ListItemIcon>
                        )}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
