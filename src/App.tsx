import { FunctionComponent } from "react"
import {useState} from "react"
import { HeaderTabsColored } from "./components/header/Header"
import { Container, MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import { TabProvider } from "./contexts/TabContext"
import MainContent from "./components/mainContent/mainContent"

const App: FunctionComponent = () => {
  const mockData = {
    user: {
      name: "Antoni Karwosky",
      image: "https://avatars.githubusercontent.com/u/70971641?v=4",
    },
    tabs: [],
  }
  const [tab, setTab] = useState<String>("")

  return (
    <TabProvider value={[tab, setTab]}>
      <MantineProvider>
        <NotificationsProvider>
          <Container>
            <HeaderTabsColored {...mockData} />
            <MainContent />
          </Container>
        </NotificationsProvider>
      </MantineProvider>
    </TabProvider>
  )
}

export default App
