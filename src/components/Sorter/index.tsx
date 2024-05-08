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
import { usePopper } from '../../hooks/usePopper'

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
  const [popperState, openPopper, closePopper] = usePopper()
  const { t } = useTranslation()

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
      <SorterButton
        aria-describedby={popperState.id}
        isOpened={popperState.open}
        onClick={openPopper}
      >
        {getCurrentOptionLabel()}
      </SorterButton>
      <Popper
        {...popperState}
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
              <ClickAwayListener onClickAway={closePopper}>
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
