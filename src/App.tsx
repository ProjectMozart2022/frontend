import { FunctionComponent } from "react"
import { Navigate, Route, Routes } from "react-router"
import ErrorPage from "./pages/ErrorPage"
import LessonPage from "./pages/LessonPage"
import LoginPage from "./pages/LoginPage"
import ReportPage from "./pages/ReportPage"
import StudentPage from "./pages/StudentPage"
import SubjectPage from "./pages/SubjectPage"
import TeacherPage from "./pages/TeacherPage"

const App: FunctionComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/uczniowie" element={<StudentPage />} />
      <Route path="/nauczyciele" element={<TeacherPage />} />
      <Route path="/przedmioty" element={<SubjectPage />} />
      <Route path="/lekcje" element={<LessonPage />} />
      <Route path="/raport" element={<ReportPage />} />

      <Route path="error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
