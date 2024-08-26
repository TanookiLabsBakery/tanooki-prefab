import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom"
import {
  credentialsLoginPath,
  emailAuthPath,
  loginPath,
  rootPath,
  profilePath,
  dashboardPath,
} from "~/common/paths"
import { RootScreen } from "./root-screen"
import { CredentialsLoginScreen } from "~/login/credentials-login-screen"
import { EmailAuthScreen } from "~/login/email-auth-screen"
import { EmailLoginScreen } from "~/login/email-login-screen"
import { RootLayout } from "./root-layout"
import { ErrorBoundary } from "../ui/error-boundary"
import {
  RequireSystemAdminSignedIn,
  RequireUserSignedIn,
  RequireUserSignedOut,
} from "~/auth/auth-layouts"
import { LoginLayout } from "~/auth/login-layout"
import { SidebarLayout } from "~/layouts/sidebar-layout"
import { ProfileScreen } from "~/profile/profile-screen"
import { AdminDashboardScreen } from "~/admin/admin-dashboard-screen"

const systemAdminAuthenticatedRoutes: Array<RouteObject> = [
  {
    path: dashboardPath.pattern,
    element: <AdminDashboardScreen />,
  },
]

const authenticatedRoutes: Array<RouteObject> = [
  {
    path: profilePath.pattern,
    element: <ProfileScreen />,
  },
]

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <RequireSystemAdminSignedIn />,
        children: [
          {
            element: <SidebarLayout />,
            children: [
              {
                element: <Outlet />,
                children: [...systemAdminAuthenticatedRoutes],
              },
            ],
          },
        ],
      },
      {
        element: <RequireUserSignedIn />,
        children: [
          {
            element: <SidebarLayout />,
            children: [
              {
                element: <Outlet />,
                children: [...authenticatedRoutes],
              },
            ],
          },
        ],
      },
      {
        element: <RequireUserSignedOut />,
        children: [
          {
            element: <LoginLayout />,
            children: [
              {
                path: loginPath.pattern,
                element: <EmailLoginScreen />,
              },
              {
                path: credentialsLoginPath.pattern,
                element: <CredentialsLoginScreen />,
              },
              {
                path: emailAuthPath.pattern,
                element: <EmailAuthScreen />,
              },
            ],
          },
        ],
      },
      {
        path: rootPath.pattern,
        element: <RootScreen />,
      },
    ],
  },
])
