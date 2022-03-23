import { FunctionComponent } from "react"
import { Container } from "react-bootstrap"
import StudentContainer from "./components/StudentContainer"

const App: FunctionComponent = () => {
  return (
    <Container>
      <StudentContainer />
    </Container>
  )
}

export default App
