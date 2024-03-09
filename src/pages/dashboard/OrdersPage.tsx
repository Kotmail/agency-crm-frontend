import { FC } from 'react'
import { OrderList } from '../../components/OrderList'
import { Hider } from '../../components/Hider'
import { UserRole } from '../../models/IUser'
import { useDialogs } from '../../hooks/useDialogs'
import {
  OrderFormDialog,
  OrderFormDialogProps,
} from '../../components/dialogs/OrderFormDialog'
import { DIALOG_BASE_OPTIONS } from '../../utils/consts'
import { PageHeader } from '../../components/PageHeader'
import { CreateEntityButton } from '../../components/CreateEntityButton'

type DialogVariants = {
  orderForm: OrderFormDialogProps
}

export const OrdersPage: FC = () => {
  const [dialogs, openDialog] = useDialogs<DialogVariants>({
    orderForm: {
      open: false,
    },
  })

  return (
    <>
      <PageHeader title="page_header.titles.orders">
        <Hider roles={[UserRole.EXECUTOR]}>
          <CreateEntityButton
            text="buttons.new_order"
            onClick={() =>
              openDialog('orderForm', DIALOG_BASE_OPTIONS.form.addOrder)
            }
          />
        </Hider>
      </PageHeader>
      <OrderList />
      <OrderFormDialog {...dialogs.orderForm} />
    </>
  )
}
