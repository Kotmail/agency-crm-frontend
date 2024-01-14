import { FC, useId } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

type ConfirmProps = {
  title: string;
  description?: string;
  cancelBtnLabel?: string;
  confirmBtnLabel: string;
  cancelBtnHandler: () => void;
  confirmBtnHandler: () => void;
} & DialogProps

export const Confirm: FC<ConfirmProps> = ({ title, description, cancelBtnLabel, confirmBtnLabel, cancelBtnHandler, confirmBtnHandler, ...props }) => {
  const { t } = useTranslation()
  const confirmTitleId = useId()
  const confirmDescId = useId()

  return (
    <Dialog
      onClose={cancelBtnHandler}
      aria-labelledby={confirmTitleId}
      aria-describedby={confirmDescId}
      {...props}
    >
      <DialogTitle id={confirmTitleId}>{title}</DialogTitle>
      {
        description &&
        <DialogContent>
          <DialogContentText id={confirmDescId}>{description}</DialogContentText>
        </DialogContent>
      }
      <DialogActions>
        <Button onClick={cancelBtnHandler}>{cancelBtnLabel ||  t('buttons.cancel')}</Button>
        <Button color="error" onClick={confirmBtnHandler}>{confirmBtnLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}