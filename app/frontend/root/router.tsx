import { createBrowserRouter } from "react-router-dom"
import {
  credentialsLoginPath,
  emailAuthPath,
  emailLoginPath,
  loginPath,
  rootPath,
} from "~/common/paths"
import { LandingScreen } from "~/landing/landing-screen"
import { CredentialsLoginScreen } from "~/login/credentials-login-screen"
import { EmailAuthScreen } from "~/login/email-auth-screen"
import { EmailLoginScreen } from "~/login/email-login-screen"
import { RootLayout } from "./root-layout"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorBoundary />, TODO
    children: [
      {
        path: rootPath.pattern,
        element: <LandingScreen />,
      },
      {
        path: loginPath.pattern,
        element: <EmailLoginScreen />,
      },
      {
        path: emailLoginPath.pattern,
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
])
