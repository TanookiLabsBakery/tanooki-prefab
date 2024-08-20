// type safe paths
// https://github.com/garybernhardt/static-path
//
// tip: always call these as a function even if they don't take parameters
// e.g.  <Link to={rootPath({})}> and not <Link to={rootPath.pattern}>

import { path } from "static-path"

export const rootPath = path("/")
export const loginPath = path("/login")
