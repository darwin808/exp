/**
 * Property of Darwin Apolinario
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
