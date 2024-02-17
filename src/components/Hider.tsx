import { FC, PropsWithChildren } from "react";
import { UserRole } from "../models/IUser";
import { useAppSelector } from "../hooks/useAppSelector";

type HiderProps = {
  roles: UserRole[]
} & PropsWithChildren

export const Hider: FC<HiderProps> = ({ children, roles }) => {
  const { user } = useAppSelector(state => state.auth)

  return user && roles.includes(user.role) ? null : children;
}