import { RouteObject, createBrowserRouter } from "react-router-dom"
import {
  credentialsLoginPath,
  emailAuthPath,
  loginPath,
  rootPath,
  dashboardPath,
} from "~/common/paths"
import { RootScreen } from "./root-screen"
import { CredentialsLoginScreen } from "~/login/credentials-login-screen"
import { EmailAuthScreen } from "~/login/email-auth-screen"
import { EmailLoginScreen } from "~/login/email-login-screen"
import { RootLayout } from "./root-layout"
import { ErrorBoundary } from "../ui/error-boundary"
import { RequireUserSignedIn, RequireUserSignedOut } from "~/auth/auth-layouts"
import { LoginLayout } from "~/auth/login-layout"
import { SidebarLayout } from "~/layouts/sidebar-layout"
import { TopBarLayout } from "~/layouts/top-bar-layout"
import { ProfileScreen } from "~/profile/profile-screen"

const authenticatedRoutes: Array<RouteObject> = [
  {
    path: dashboardPath.pattern,
    element: <ProfileScreen />,
    handle: {
      title: "Profile",
    },
  },
]

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <RequireUserSignedIn />,
        children: [
          {
            element: <SidebarLayout />,
            children: [
              {
                element: <TopBarLayout />,
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
