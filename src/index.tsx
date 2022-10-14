import { MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"

const container = document.getElementById("root")
const root = createRoot(container as HTMLElement)
const queryClient = new QueryClient()
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>
)
