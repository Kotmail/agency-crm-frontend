import { SortData, SortOption } from '.'
import { MenuList, MenuListProps } from '@mui/material'
import { SorterItem } from './SorterItem'

type SorterListProps = {
  options: SortOption[]
  sortData: SortData
  sortField: keyof SortData
  onChangeItemHandler: (sortData: SortData) => void
} & MenuListProps

export const SorterList = ({
  options,
  sortData,
  sortField,
  onChangeItemHandler,
  ...props
}: SorterListProps) => {
  const onSelectItemHandler = (option: SortOption) =>
    onChangeItemHandler({ ...sortData, [sortField]: option.key })

  return (
    <MenuList {...props}>
      {options.map((option) => {
        const isCurrentItem = option.key === sortData[sortField]

        return (
          <SorterItem
            key={option.key}
            option={option}
            onClick={() => onSelectItemHandler(option)}
            disabled={isCurrentItem}
            selected={isCurrentItem}
            dense
            sx={{
              '&.Mui-disabled': { opacity: 1 },
            }}
          />
        )
      })}
    </MenuList>
  )
}
