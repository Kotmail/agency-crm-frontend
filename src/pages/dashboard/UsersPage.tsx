import { FC, useState } from "react";
import { UserList } from "../../components/UserList";
import { Box, Button } from "@mui/material";
import { AddUserDialog } from "../../components/dialogs/AddUserDialog";

type dialogVariants = {
  addUser: boolean;
}

type dialogVariantsEnum = keyof dialogVariants

export const UsersPage: FC = () => {
  const [openedDialogs, setOpenedDialogs] = useState<dialogVariants>({
    addUser: false,
  })

  const dialogStateHandler = (dialogName: dialogVariantsEnum, isOpened: boolean) => {
    setOpenedDialogs({
      ...openedDialogs,
      [dialogName]: isOpened,
    })
  }

  return (
    <>
      <Box paddingBottom={3}>
        <Button
          variant="contained"
          onClick={() => dialogStateHandler('addUser', true)}
        >
          Добавить пользователя
        </Button>
      </Box>
      <UserList />
      <AddUserDialog
        open={openedDialogs.addUser}
        onClose={() => dialogStateHandler('addUser', false)}
      />
    </>
  );
}