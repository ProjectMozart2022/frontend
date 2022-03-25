import { FunctionComponent } from "react"
import { TeacherForm } from "./components/TeacherForm"
import { HeaderTabsColored } from "./components/Header"
import { Container } from "@mantine/core"
import StudentContainer from "./components/StudentContainer"

const App: FunctionComponent = () => {
  const mockData = {
    user: {
      name: "Antoni Karwosky",
      image: "https://avatars.githubusercontent.com/u/70971641?v=4",
    },
    tabs: [],
  }
  return (
    <Container>
      <HeaderTabsColored {...mockData} />
      <TeacherForm />
    </Container>
  )
}

export default App
