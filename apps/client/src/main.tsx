/**
 * Property of the Metropolitan Bank & Trust Co.
 * Reuse as a whole or in part is prohibited without permission.
 * Created by the Product Engineering team/Digital Banking Division
 */
import "./index.css"
import "react-tooltip/dist/react-tooltip.css"

import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./App"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
