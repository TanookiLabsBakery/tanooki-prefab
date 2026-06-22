// type safe paths
// https://github.com/garybernhardt/static-path
//
// tip: unless you're adding the route to the router, always call these as a
// function even if they don't take parameters
// e.g.  <Link to={rootPath({})}> and not <Link to={rootPath.pattern}>
import { path } from "static-path"

export const rootPath = path("/")
export const dashboardPath = path("/dashboard")
export const featuresPath = path("/features")
export const loginPath = path("/login")
export const credentialsLoginPath = path("/login/credentials")
export const detailsPath = path("/details")
export const profilePath = path("/profile")
export const profileEditPath = path("/profile/edit")
export const internalAdminDashboardPath = path("/internal-admin/dashboard")
export const emailAuthPath = path("/auth/email/:email/:token/:clientAuthCode")
export const connectChannelPath = path("/dashboard/channels/connect")
export const connectChannelFinishPath = path("/dashboard/channels/connect/finish")
export const composerPath = path("/dashboard/compose")
export const calendarPath = path("/dashboard/calendar")
export const postAnalyticsPath = path("/dashboard/posts/:postId/analytics")
export const onboardingWelcomePath = path("/onboarding/welcome")
export const settingsPath = path("/dashboard/settings")
export const composePath = path("/dashboard/compose")
export const analyticsPath = path("/dashboard/analytics")
export const allPostsPath = path("/dashboard/posts")
