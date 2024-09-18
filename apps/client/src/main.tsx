/**
 * Property of Darwin Apolinario
 */
import "./index.css"
import "react-tooltip/dist/react-tooltip.css"
import "react-toastify/dist/ReactToastify.css"

import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import App from "./App"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </BrowserRouter>
)
