import { MouseEvent, useId, useState } from 'react'
import {
  Box,
  ClickAwayListener,
  FormControl,
  FormGroup,
  FormLabel,
  Grow,
  Paper,
  Popper,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { OrdersFilterParams } from '../../redux/api/ordersApi'
import { FilterButton } from './FilterButton'
import { FilterOptionList } from './FilterOptionList'

export type FilterOption = {
  label: string
  name: keyof OrdersFilterParams
  value: string | boolean
}

export type FilterGroup = {
  legend: string
  options?: FilterOption[]
}

type FilterProps = {
  optionGroups: FilterGroup[]
  filterData: OrdersFilterParams
  onChangeFilterHandler: (filterData: OrdersFilterParams) => void
}

export const Filter = ({
  optionGroups,
  filterData,
  onChangeFilterHandler,
}: FilterProps) => {
  const [popperAnchor, setAnchorPopper] = useState<null | HTMLButtonElement>(
    null,
  )
  const isPopperOpened = Boolean(popperAnchor)
  const popperId = useId()
  const { t } = useTranslation()

  const openPopperHandler = (e: MouseEvent<HTMLButtonElement>) =>
    setAnchorPopper(e.currentTarget)

  const closePopperHandler = () => setAnchorPopper(null)

  if (!filterData) {
    return null
  }

  return (
    <>
      <FilterButton onClick={openPopperHandler} />
      <Popper
        id={popperId}
        open={isPopperOpened}
        anchorEl={popperAnchor}
        placement="bottom-end"
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
                <Box padding="8px 16px">
                  {optionGroups.map((group) => (
                    <FormControl
                      key={group.legend}
                      component="fieldset"
                      variant="standard"
                      sx={{ display: 'flex' }}
                    >
                      <FormLabel component="legend" sx={{ fontSize: '14px' }}>
                        {t(group.legend)}
                      </FormLabel>
                      <FormGroup>
                        {group.options && (
                          <FilterOptionList
                            options={group.options}
                            filterData={filterData}
                            onChangeFilterHandler={onChangeFilterHandler}
                          />
                        )}
                      </FormGroup>
                    </FormControl>
                  ))}
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
