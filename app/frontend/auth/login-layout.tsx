import { Outlet } from "react-router-dom"

export const LoginLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-[353px]">
        <div className="grid gap-8 py-8">
          <Outlet />

          <div>
            <div className="text-center text-xs">
              © {new Date().getFullYear()} Prefab Copyright All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
