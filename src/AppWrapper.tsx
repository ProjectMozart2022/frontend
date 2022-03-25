import { FunctionComponent } from "react"
import { Routes, Route } from "react-router"
import App from "./App"
import StudentContainer from "./components/StudentContainer"

const AppWrapper: FunctionComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="students" element={<StudentContainer />} />
    </Routes>
  )
}

export default AppWrapper
