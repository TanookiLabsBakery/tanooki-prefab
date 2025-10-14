// type safe paths
// https://github.com/garybernhardt/static-path
//
// tip: unless you're adding the route to the router, always call these as a
// function even if they don't take parameters
// e.g.  <Link to={rootPath({})}> and not <Link to={rootPath.pattern}>
import { path } from "static-path"

export const rootPath = path("/")
export const loginPath = path("/login")
export const credentialsLoginPath = path("/login/credentials")
export const detailsPath = path("/details")
export const profilePath = path("/profile")
export const profileEditPath = path("/profile/edit")
export const dashboardPath = path("/dashboard")
export const emailAuthPath = path("/auth/email/:email/:token/:clientAuthCode")
