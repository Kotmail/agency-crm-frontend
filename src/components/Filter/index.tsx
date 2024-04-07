import { MouseEvent, useId, useState } from 'react'
import {
  Box,
  Checkbox,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grow,
  IconButton,
  Paper,
  Popper,
  Tooltip,
} from '@mui/material'
import { Tune } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { OrdersFilterParams } from '../../redux/api/ordersApi'

type FilterCheckbox = {
  label: string
  name: keyof OrdersFilterParams
  value: string | boolean
}

export type FilterGroup = {
  legend: string
  checkboxes?: FilterCheckbox[]
}

type FilterProps = {
  optionGroups: FilterGroup[]
  filterData: OrdersFilterParams
  onApplyChangesHandler: (filterData: OrdersFilterParams) => void
}

export const Filter = ({
  optionGroups,
  filterData,
  onApplyChangesHandler,
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

  const changeOptionHandler = (option: FilterCheckbox, isChecked: boolean) => {
    const currentOptions = { ...filterData }

    switch (option.name) {
      case 'priority':
      case 'status':
        if (!currentOptions[option.name]) {
          currentOptions[option.name] = [option.value as string]
        } else {
          const optionsArray = currentOptions[option.name]!.slice()
          const existsOptionIdx = optionsArray.findIndex(
            (value) => value === option.value,
          )

          if (existsOptionIdx !== -1) {
            optionsArray.splice(existsOptionIdx, 1)
          } else {
            optionsArray.push(option.value as string)
          }

          if (optionsArray.length) {
            currentOptions[option.name] = optionsArray
          } else {
            delete currentOptions[option.name]
          }
        }
        break

      case 'isArchived':
        currentOptions[option.name] = isChecked
        break
    }

    onApplyChangesHandler(currentOptions)
  }

  const isCheckedOption = (checkbox: FilterCheckbox) => {
    const currentPropertyData = filterData[checkbox.name]

    if (!currentPropertyData) {
      return false
    }

    if (typeof currentPropertyData === 'boolean') {
      return currentPropertyData
    }

    return currentPropertyData.includes(checkbox.value as string)
  }

  if (!filterData) {
    return null
  }

  return (
    <>
      <Tooltip title={t('filter.tooltip')}>
        <IconButton
          size="small"
          color="primary"
          sx={{
            borderRadius: '4px',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            ':hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
            '& .MuiTouchRipple-root .MuiTouchRipple-child': {
              borderRadius: '4px',
            },
          }}
          onClick={openPopperHandler}
        >
          <Tune sx={{ fontSize: '19px' }} />
        </IconButton>
      </Tooltip>
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
                        {group.checkboxes &&
                          group.checkboxes.length > 0 &&
                          group.checkboxes?.map((checkbox, i) => (
                            <FormControlLabel
                              key={i}
                              control={
                                <Checkbox
                                  onChange={(e) =>
                                    changeOptionHandler(
                                      checkbox,
                                      e.target.checked,
                                    )
                                  }
                                  name={checkbox.name}
                                  size="small"
                                  value={checkbox.value}
                                  checked={isCheckedOption(checkbox)}
                                />
                              }
                              label={t(checkbox.label)}
                              sx={{
                                '.MuiFormControlLabel-label': {
                                  fontSize: '14px',
                                },
                              }}
                            />
                          ))}
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
