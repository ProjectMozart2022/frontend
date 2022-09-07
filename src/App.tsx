import { Container } from "@mantine/core"
import { getAuth } from "firebase/auth"
import { FunctionComponent } from "react"
import { Navigate, Route, Routes } from "react-router"
import { Header } from "./components/header/Header"
import { LessonForm } from "./components/Lesson/LessonForm"
import LoginScreen from "./components/login/LoginView"
import ReportContainer from "./components/Report/ReportContainer"
import StudentContainer from "./components/Student/StudentContainer"
import SubjectContainer from "./components/Subject/SubjectContainer"
import TeacherContainer from "./components/Teacher/TeacherContainer"

const DEFAULT_PICTURE_URL =
  "https://st3.depositphotos.com/1767687/16607/v/600/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg"

// TODO: work on this
const App: FunctionComponent = () => {
  const auth = getAuth()
  const user = auth.currentUser
  const headerUser = {
    name: user?.displayName || "Antoni Karwosky",
    image: user?.photoURL || DEFAULT_PICTURE_URL,
  }

  return user !== null ? (
    <Container>
      <Header user={headerUser} />
      <Routes>
        <Route path="/" element={<Navigate to="/uczniowie" />} />
        <Route path="/uczniowie" element={<StudentContainer />} />
        <Route path="/nauczyciele" element={<TeacherContainer />} />
        <Route path="/przedmioty" element={<SubjectContainer />} />
        <Route path="/lekcje" element={<LessonForm />} />
        <Route path="/raport" element={<ReportContainer />} />

        {/* TO BE ADDED */}
        {/* <Route path="error" element={<ErrorPage />} /> */}
        <Route path="*" element={<Navigate to="/uczniowie" />} />
      </Routes>
    </Container>
  ) : (
    <LoginScreen />
  )
}

export default App
