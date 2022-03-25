import { FunctionComponent } from "react"
import { Container } from "react-bootstrap"
import { TeacherForm } from "./components/TeacherForm"
import { HeaderTabsColored } from "./components/Header"


const App: FunctionComponent = () => {
  const mockData = {
    user: {
      name: "Antoni Karwosky",
      image: "https://avatars.githubusercontent.com/u/70971641?v=4",
    },
    tabs: [
    ],
  }
  return (
    <Container>
      <HeaderTabsColored {...mockData} />
      <TeacherForm />
    </Container>
  )
}

export default App
