import { FC } from "react";
import { UserList } from "../../components/UserList";
import { Box, Button } from "@mui/material";
import { AddUserDialog } from "../../components/dialogs/AddUserDialog";
import { useDialogs } from "../../hooks/useDialogs";

type dialogVariants = {
  addUser: boolean;
}

export const UsersPage: FC = () => {
  const [openedDialogs, setOpenedDialogs] = useDialogs<dialogVariants>({
    addUser: false,
  })

  return (
    <>
      <Box paddingBottom={3}>
        <Button
          variant="contained"
          onClick={() => setOpenedDialogs('addUser', true)}
        >
          Добавить пользователя
        </Button>
      </Box>
      <AddUserDialog
        open={openedDialogs.addUser}
        onClose={() => setOpenedDialogs('addUser', false)}
      />
      <UserList />
    </>
  );
}