import { createBrowserRouter } from "react-router-dom"
import { rootPath } from "~/common/paths"
import { LandingScreen } from "~/landing/landing-screen"
import { RootLayout } from "./root-layout"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorBoundary />, TODO
    children: [
      {
        path: rootPath({}),
        element: <LandingScreen />,
      },
    ],
  },
])
