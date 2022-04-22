import { FunctionComponent, useContext } from "react"
import TabContext from "../../contexts/TabContext"
import { LessonForm } from "../Lesson/LessonForm"
import StudentContainer from "../Student/StudentContainer"
import TeacherContainer from "../Teacher/TeacherContainer"
import SubjectContainer from "../Subject/SubjectContainer"

const MainContent: FunctionComponent = () => {
  const [tab, ] = useContext(TabContext)
  const renderContent = (tab: string) => {
    switch (tab) {
    case "uczniowie":
      return <StudentContainer />
    case "nauczyciele":
      return <TeacherContainer />
    case "przedmioty":
      return <SubjectContainer />
    case "lekcje":
      return <LessonForm />
    default:
      return <StudentContainer />
    }
  }

  return renderContent(tab)
}

export default MainContent
