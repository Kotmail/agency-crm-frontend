import { FC } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserRole } from "../models/IUser";
import { ModalInfoDialog } from "./dialogs/ModalInfoDialog";
import { useTranslation } from "react-i18next";

type AllowedRolesProp = {
  [key: string]: UserRole[]
}

type AuthGuardProps = {
  allowedRoles?: AllowedRolesProp
}

export const AuthGuard: FC<AuthGuardProps> = ({ allowedRoles }) => {
  const { user: authUser } = useAppSelector(state => state.auth)
  const location = useLocation()
  const { t } = useTranslation()

  if (!authUser) {
    return <Navigate to={'/'} replace />
  }

  if (allowedRoles) {
    const currentPage = location.pathname
      .split('/')
      .filter(path => path)
      .pop()
    const currentPageRoles = currentPage && allowedRoles[currentPage]

    if (currentPageRoles && !currentPageRoles.includes(authUser.role)) {
      return (
        <ModalInfoDialog
          open
          title={t('dialogs.not_authorized.title')}
          fullWidth
          maxWidth="xs"
          description={t('dialogs.not_authorized.desc')}
        />
      )
    }
  }

  return <Outlet />
}