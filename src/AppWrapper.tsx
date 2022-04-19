import { Container } from "@mantine/core"
import { FunctionComponent } from "react"
import { HeaderTabsColored } from "./components/header/Header"
import { useFirebaseAuth } from "./contexts/UserContext"
import LoginScreen from "./components/LoginView"
import MainContent from "./components/mainContent/mainContent"

const DEFAULT_PICTURE_URL =
  "https://st3.depositphotos.com/1767687/16607/v/600/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg"

const AppWrapper: FunctionComponent = () => {
  const user = useFirebaseAuth()
  const headerUser = {
    name: user?.displayName || "Antoni Karwosky",
    image: user?.photoURL || DEFAULT_PICTURE_URL,
  }

  return (
    <Container>
      {user !== null ? (
        <Container style={{ margin: 0, padding: 0 }}>
          <HeaderTabsColored user={headerUser} />
          <MainContent />
        </Container>
      ) : (
        <LoginScreen />
      )}
    </Container>
  )
}

export default AppWrapper
