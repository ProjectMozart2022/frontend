import { MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import UserContext from "./contexts/UserContext"
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <UserContext>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContext>
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>
)
