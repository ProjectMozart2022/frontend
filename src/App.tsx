import { FunctionComponent } from "react"
import { Container } from "@mantine/core"
import StudentContainer from "./components/StudentContainer"

const App: FunctionComponent = () => {
  return (
    <Container>
      <StudentContainer />
    </Container>
  )
}

export default App
