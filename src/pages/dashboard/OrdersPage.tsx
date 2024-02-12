import { FC, useState } from "react";
import { OrderList } from "../../components/OrderList";
import { Box, Button } from "@mui/material";
import { AddOrderDialog } from "../../components/dialogs/AddOrderDialog";

type dialogVariants = {
  addOrder: boolean;
}

type dialogVariantsEnum = keyof dialogVariants

export const OrdersPage: FC = () => {
  const [openedDialogs, setOpenedDialogs] = useState<dialogVariants>({
    addOrder: false,
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
          onClick={() => dialogStateHandler('addOrder', true)}
        >
          Добавить заказ
        </Button>
      </Box>
      <OrderList />
      <AddOrderDialog
        open={openedDialogs.addOrder}
        onClose={() => dialogStateHandler('addOrder', false)}
      />
    </>
  );
}