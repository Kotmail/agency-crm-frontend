import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  styled,
  Typography,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  useId,
  useState,
} from 'react'
import { FieldError } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

const UploadWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
})

const ControlsWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 8,
})

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const Note = styled(Typography)({
  width: '100%',
  lineHeight: 'normal',
  color: grey[500],
})

type AvatarUploaderProps = {
  preview: string | null
  label?: string
  error?: FieldError
  onChangeHandler: (value: File | null) => void
} & InputHTMLAttributes<HTMLInputElement>

export const AvatarUploader = forwardRef<HTMLInputElement, AvatarUploaderProps>(
  (
    { preview, label, onChangeHandler, error, ...props }: AvatarUploaderProps,
    ref,
  ) => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(preview)
    const { t } = useTranslation()
    const helperTextId = useId()

    const onUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setAvatarPreview(URL.createObjectURL(e.target.files[0]))
        onChangeHandler(e.target.files[0])
      }
    }

    const onRemoveFile = () => {
      onChangeHandler(null)
      setAvatarPreview(null)
    }

    return (
      <FormControl>
        {label && <FormLabel sx={{ marginBottom: '9px' }}>{label}</FormLabel>}
        <UploadWrapper>
          <Avatar
            src={avatarPreview || undefined}
            sx={{
              width: 70,
              height: 70,
            }}
          />
          <ControlsWrapper>
            <Button
              component="label"
              variant="outlined"
              role={undefined}
              tabIndex={-1}
              size="small"
            >
              {t(`buttons.${avatarPreview ? 'change' : 'upload'}`)}
              <VisuallyHiddenInput
                {...props}
                type="file"
                ref={ref}
                onChange={onUploadFile}
                aria-invalid={error ? true : false}
                aria-describedby={error ? helperTextId : undefined}
              />
            </Button>
            {avatarPreview && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={onRemoveFile}
              >
                {t('buttons.delete')}
              </Button>
            )}
            <Note variant="caption">
              <Trans i18nKey="avatar_uploader.note" />
            </Note>
          </ControlsWrapper>
        </UploadWrapper>
        {error && (
          <FormHelperText id={helperTextId} error>
            {t(`${error.message}`)}
          </FormHelperText>
        )}
      </FormControl>
    )
  },
)
