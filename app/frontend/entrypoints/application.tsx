import { createRoot } from "react-dom/client"
import App from "~/root/app"

const rootEl = document.getElementById("react-root")
if (rootEl) {
  const root = createRoot(rootEl)
  root.render(<App />)
} else {
  console.error("no react-root")
}
