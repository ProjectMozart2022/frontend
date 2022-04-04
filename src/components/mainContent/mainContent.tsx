import { FunctionComponent, useContext } from "react"
import TabContext from "../../contexts/TabContext"
import { ProfileForm } from "../Profile/ProfileForm"
import StudentContainer from "../Student/StudentContainer"
import TeacherContainer from "../Teacher/TeacherContainer"

const MainContent: FunctionComponent = () => {
  const [tab, ] = useContext(TabContext)
  const renderContent = (tab: String) => {
    switch (tab) {
      case "uczniowie":
        return <StudentContainer />
      case "nauczyciele":
        return <TeacherContainer />
      case "profile":
        return <ProfileForm />
      default:
        return <StudentContainer />
    }
  }

  return renderContent(tab)
}

export default MainContent
