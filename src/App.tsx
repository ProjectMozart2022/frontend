import { FunctionComponent, useState } from "react"
import { MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import UserContext from "./contexts/UserContext"

import AppWrapper from "./AppWrapper"
import { TabProvider } from "./contexts/TabContext"

const App: FunctionComponent = () => {
  const [tab, setTab] = useState<string>("")

  return (
    <UserContext>
      <TabProvider value={[tab, setTab]}>
        <MantineProvider>
          <NotificationsProvider>
            <AppWrapper />
          </NotificationsProvider>
        </MantineProvider>
      </TabProvider>
    </UserContext>
  )
}

export default App
