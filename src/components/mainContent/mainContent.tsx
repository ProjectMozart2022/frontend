import { FunctionComponent, useContext } from "react"
import TabContext from "../../contexts/TabContext"
import { LessonForm } from "../Lesson/LessonForm"
import StudentContainer from "../Student/StudentContainer"
import TeacherContainer from "../Teacher/TeacherContainer"
import SubjectContainer from "../Subject/SubjectContainer"
import ReportContainer from "../Report/ReportContainer"

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
    case "raport":
      return <ReportContainer />
    default:
      return <StudentContainer />
    }
  }

  return renderContent(tab)
}

export default MainContent
