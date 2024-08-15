import { createRoot } from "react-dom/client"
import App from "~/root/app"

const rootEl = document.getElementById("react-root")
if (rootEl) {
  const root = createRoot(rootEl)
  root.render(<App />)
} else {
  // eslint-disable-next-line no-console
  console.error("no react-root")
}
