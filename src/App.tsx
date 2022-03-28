import { FunctionComponent } from "react"
import { TeacherForm } from "./components/Teacher/TeacherForm"
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
          <TeacherForm />
        </Container>
      </NotificationsProvider>
    </MantineProvider>
  )
}

export default App
