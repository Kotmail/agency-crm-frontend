import { FC, useId } from "react";
import { Dialog, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";

type ModalInfoDialogProps = {
  title: string
  description?: string
} & DialogProps

export const ModalInfoDialog: FC<ModalInfoDialogProps> = ({ title, description, ...props }) => {
  const titleId = useId()
  const descId = useId()
  
  return (
    <Dialog
      aria-labelledby={titleId}
      aria-describedby={descId}
      {...props}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      {
        description &&
        <DialogContent>
          <DialogContentText id={descId}>
            {description}
          </DialogContentText>
        </DialogContent>
      }
    </Dialog>
  );
}