import { Container } from "@mantine/core"
import { FunctionComponent } from "react"
import { HeaderTabsColored } from "./components/header/Header"
import { useFirebaseAuth } from "./contexts/UserContext"
import LoginScreen from "./components/LoginView"
import MainContent from "./components/mainContent/mainContent"

const AppWrapper: FunctionComponent = () => {
  const user = useFirebaseAuth()

  const mockData = {
    user: {
      name: "Antoni Karwosky",
      image: "https://avatars.githubusercontent.com/u/70971641?v=4",
    },
    tabs: [],
  }

  return (
    <Container>
      {user !== null ? (
        <Container>
          <HeaderTabsColored {...mockData} />
          <MainContent />
        </Container>
      ) : (
        <LoginScreen />
      )}
    </Container>
  )
}

export default AppWrapper
