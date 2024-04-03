import { MouseEvent, useId, useState } from 'react'
import {
  Box,
  ClickAwayListener,
  Divider,
  Grow,
  Paper,
  Popper,
} from '@mui/material'
import { FilterList, SvgIconComponent } from '@mui/icons-material'
import { SorterHeading } from './SorterHeading'
import { useTranslation } from 'react-i18next'
import { SorterList } from './SorterList'
import { SorterButton } from './SorterButton'

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
  options: SortOption[]
  sortData: SortData
  onChangeSortHandler: (sortData: SortData) => void
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
  options,
  sortData,
  onChangeSortHandler,
}: SorterProps) => {
  const [popperAnchor, setAnchorPopper] = useState<null | HTMLButtonElement>(
    null,
  )
  const isPopperOpened = Boolean(popperAnchor)
  const popperId = useId()
  const { t } = useTranslation()

  const openPopperHandler = (e: MouseEvent<HTMLButtonElement>) =>
    setAnchorPopper(e.currentTarget)

  const closePopperHandler = () => setAnchorPopper(null)

  const getCurrentOptionLabel = () => {
    const currentOption = options.find(
      (option) => option.key === sortData['sortby'],
    )

    return t('sorter.button_text', {
      option_label: t(currentOption!.label).toLowerCase(),
    })
  }

  return (
    <>
      <SorterButton isOpened={isPopperOpened} onClick={openPopperHandler}>
        {getCurrentOptionLabel()}
      </SorterButton>
      <Popper
        id={popperId}
        open={isPopperOpened}
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
                  <SorterList
                    options={options}
                    sortData={sortData}
                    sortField="sortby"
                    onChangeItemHandler={onChangeSortHandler}
                  />
                  <Divider variant="middle" />
                  <SorterHeading>{t('sorter.orderby_label')}</SorterHeading>
                  <SorterList
                    options={orderByOptions}
                    sortData={sortData}
                    sortField="orderby"
                    onChangeItemHandler={onChangeSortHandler}
                  />
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
