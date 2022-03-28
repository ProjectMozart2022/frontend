import { FunctionComponent } from "react"
import { HeaderTabsColored } from "./components/header/Header"
import { Container, MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"

const App: FunctionComponent = () => {
  const mockData = {
    user: {
      name: "Antoni Karwosky",
      image: "https://avatars.githubusercontent.com/u/70971641?v=4",
    },
    tabs: [],
  }

  return (
    <MantineProvider>
      <NotificationsProvider>
        <Container>
          <HeaderTabsColored {...mockData} />
        </Container>
      </NotificationsProvider>
    </MantineProvider>
  )
}

export default App
