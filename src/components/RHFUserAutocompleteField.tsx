import { Autocomplete, Popper, TextField } from '@mui/material'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { getUserFullName } from '../utils/helpers/getUserFullName'
import { IUser } from '../models/IUser'
import { useTranslation } from 'react-i18next'
import { AutocompleteUserOption } from './AutocompleteUserOption'

type RHFUserAutocompleteFieldProps<
  O extends IUser,
  TField extends FieldValues,
> = {
  control: Control<TField>
  name: Path<TField>
  options: O[]
  multiple?: boolean
}

export const RHFUserAutocompleteField = <
  O extends IUser,
  TField extends FieldValues,
>({
  control,
  name,
  options,
  multiple,
}: RHFUserAutocompleteFieldProps<O, TField>) => {
  const { t } = useTranslation()

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, ref, ...field },
        fieldState: { error },
      }) => (
        <Autocomplete
          {...field}
          value={multiple ? value : value && value?.id ? value : null}
          options={options}
          multiple={multiple}
          isOptionEqualToValue={(user, value) =>
            getUserFullName(user) === getUserFullName(value)
          }
          getOptionLabel={(option) =>
            (option.firstName && option.lastName && getUserFullName(option)) ||
            ''
          }
          PopperComponent={(props) => (
            <Popper
              {...props}
              popperOptions={{
                modifiers: [{ name: 'offset', options: { offset: [0, 15] } }],
              }}
              placement="top"
            />
          )}
          renderOption={(props, user) => (
            <AutocompleteUserOption key={user.id} user={user} {...props} />
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t(`input_placeholders.${name}.label`)}
              error={!!error}
              inputRef={ref}
              helperText={t(error?.message || '')}
              placeholder={t(`input_placeholders.${name}.placeholder`)}
            />
          )}
          size="small"
          openOnFocus
          onChange={(_, data) => onChange(data)}
        />
      )}
    />
  )
}
