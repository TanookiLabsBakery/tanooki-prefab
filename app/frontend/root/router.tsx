import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom"
import { InternalAdminDashboardScreen } from "~/admin/admin-dashboard-screen"
import {
  RequireSystemAdminSignedIn,
  RequireUserSignedIn,
  RequireUserSignedOut,
} from "~/auth/auth-layouts"
import { LoginLayout } from "~/auth/login-layout"
import {
  allPostsPath,
  analyticsPath,
  calendarPath,
  composerPath,
  connectChannelFinishPath,
  connectChannelPath,
  credentialsLoginPath,
  dashboardPath,
  emailAuthPath,
  featuresPath,
  internalAdminDashboardPath,
  loginPath,
  onboardingWelcomePath,
  postAnalyticsPath,
  profileEditPath,
  profilePath,
  rootPath,
  settingsPath,
} from "~/common/paths"
import { ConnectChannelScreen } from "~/dashboard/connect-channel-screen"
import { DashboardScreen } from "~/dashboard/dashboard-screen"
import { FeaturesPage } from "~/landing/features-page"
import { MarketingLayout } from "~/landing/marketing-layout"
import { SidebarLayout } from "~/layouts/sidebar-layout"
import { CredentialsLoginScreen } from "~/login/credentials-login-screen"
import { EmailAuthScreen } from "~/login/email-auth-screen"
import { EmailLoginScreen } from "~/login/email-login-screen"
import { ProfileEditScreen } from "~/profile/profile-edit-screen"
import { ProfileScreen } from "~/profile/profile-screen"
import { NotFoundScreen } from "~/root/not-found-screen"
import { BrandVoiceScreen } from "~/screens/Dashboard/BrandVoiceScreen"
import { CalendarScreen } from "~/screens/Dashboard/CalendarScreen"
import { ComposerScreen } from "~/screens/Dashboard/ComposerScreen"
import { PostAnalyticsScreen } from "~/screens/Dashboard/PostAnalyticsScreen"
import { PostsListScreen } from "~/screens/Dashboard/PostsListScreen"
import { WelcomeScreen } from "~/screens/Onboarding/WelcomeScreen"
import { AnalyticsScreen } from "~/screens/dashboard/analytics/analytics-screen"
import { ErrorBoundary } from "../ui/error-boundary"
import { RootLayout } from "./root-layout"
import { RootScreen } from "./root-screen"

const systemAdminAuthenticatedRoutes: Array<RouteObject> = [
  {
    path: internalAdminDashboardPath.pattern,
    element: <InternalAdminDashboardScreen />,
  },
]

const authenticatedRoutes: Array<RouteObject> = [
  {
    path: dashboardPath.pattern,
    element: <DashboardScreen />,
  },
  {
    path: connectChannelPath.pattern,
    element: <ConnectChannelScreen />,
  },
  {
    path: connectChannelFinishPath.pattern,
    element: <ConnectChannelScreen />,
  },
  {
    path: profilePath.pattern,
    element: <ProfileScreen />,
  },
  {
    path: profileEditPath.pattern,
    element: <ProfileEditScreen />,
  },
  {
    path: composerPath.pattern,
    element: <ComposerScreen />,
  },
  {
    path: calendarPath.pattern,
    element: <CalendarScreen />,
  },
  {
    path: postAnalyticsPath.pattern,
    element: <PostAnalyticsScreen />,
  },
  {
    path: allPostsPath.pattern,
    element: <PostsListScreen />,
  },
  {
    path: settingsPath.pattern,
    element: <BrandVoiceScreen />,
  },
  {
    path: analyticsPath.pattern,
    element: <AnalyticsScreen />,
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
          {
            path: onboardingWelcomePath.pattern,
            element: <WelcomeScreen />,
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
        element: <MarketingLayout />,
        children: [
          {
            path: rootPath.pattern,
            element: <RootScreen />,
          },
          {
            path: featuresPath.pattern,
            element: <FeaturesPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundScreen />,
      },
    ],
  },
])
