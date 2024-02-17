import { FC } from "react";
import { OrderList } from "../../components/OrderList";
import { Box, Button } from "@mui/material";
import { AddOrderDialog } from "../../components/dialogs/AddOrderDialog";
import { Hider } from "../../components/Hider";
import { UserRole } from "../../models/IUser";
import { useDialogs } from "../../hooks/useDialogs";

type dialogVariants = {
  addOrder: boolean
}

export const OrdersPage: FC = () => {
  const [openedDialogs, setOpenedDialogs] = useDialogs<dialogVariants>({
    addOrder: false,
  })

  return (
    <>
      <Hider roles={[UserRole.EXECUTOR]}>
        <Box paddingBottom={3}>
          <Button
            variant="contained"
            onClick={() => setOpenedDialogs('addOrder', true)}
          >
            Добавить заказ
          </Button>
        </Box>
        <AddOrderDialog
          open={openedDialogs.addOrder}
          onClose={() => setOpenedDialogs('addOrder', false)}
        />
      </Hider>
      <OrderList />
    </>
  );
}