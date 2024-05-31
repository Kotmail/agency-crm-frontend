import { Checkbox, FormControlLabel } from '@mui/material'
import { FilterOption } from '.'
import { useTranslation } from 'react-i18next'
import { OrdersFilterParams } from '../../redux/api/ordersApi'
import { useSearchParams } from 'react-router-dom'

type FilterOptionListProps = {
  options: FilterOption[]
  filterData: OrdersFilterParams
  onChangeFilterHandler: (filterData: OrdersFilterParams) => void
}

export const FilterOptionList = ({
  options,
  filterData,
  onChangeFilterHandler,
}: FilterOptionListProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()

  if (!options.length) {
    return null
  }

  const onChangeHandler = (option: FilterOption, isChecked: boolean) => {
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

    if (searchParams.get('page')) {
      searchParams.delete('page')
      setSearchParams(searchParams)
    }

    onChangeFilterHandler(currentOptions)
  }

  const isChecked = (option: FilterOption) => {
    const currentPropertyData = filterData[option.name]

    if (!currentPropertyData) {
      return false
    }

    if (typeof currentPropertyData === 'boolean') {
      return currentPropertyData
    }

    return currentPropertyData.includes(option.value as string)
  }

  return options.map((option, i) => (
    <FormControlLabel
      key={i}
      control={
        <Checkbox
          onChange={(e) => onChangeHandler(option, e.target.checked)}
          name={option.name}
          size="small"
          value={option.value}
          checked={isChecked(option)}
        />
      }
      label={t(option.label)}
      sx={{
        '.MuiFormControlLabel-label': {
          fontSize: '14px',
        },
      }}
    />
  ))
}
