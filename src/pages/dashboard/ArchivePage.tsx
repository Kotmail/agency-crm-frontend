import { FC } from "react";
import { OrderList } from "../../components/OrderList";

export const ArchivePage: FC = () => {
  return <OrderList state="closed" />
}