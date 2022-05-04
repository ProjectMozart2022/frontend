import { TeacherTable, TeacherTableProps } from "../Tables/TeacherTable"
import axios, { AxiosError } from "axios"
import { TeacherForm } from "./TeacherForm"
import { Container, Button, Group } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { Teacher } from "../../types/Teacher"
import { signOut } from "../../services/signOut"
import { setBearerToken } from "../../services/setBearerToken"

const SubjectContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [, setError] = useState("")

  const fetchTeachers = async () => {
    setIsLoading(true)
    try {
      await setBearerToken()
      const teachersResponse = await axios.get<Teacher[]>(`admin/teacher`)
      setTeachers(teachersResponse.data)
      setIsLoading(false)
    } catch (error) {
      setError(error as string)
      setIsLoading(false)
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  useEffect(() => {
    void fetchTeachers()
  }, [])

  const tableData: TeacherTableProps = {
    data: teachers.map((teacher) => {
      const teacherData = {
        ...teacher,
        lessons: teacher.lessons
          .map(
            (lesson) =>
              `Uczeń: ${lesson.student.firstName} ${lesson.student.lastName} \n Lekcja: ${lesson.subject.name}`
          )
          .join(", "),
      }
      return teacherData
    }),
  }

  return (
    <Container className="studentContainer">
      {!isLoading ? <TeacherTable data={tableData.data} /> : null}
      <Group position="center">
        <Button
          style={{ marginLeft: "0.75vw", marginBottom: "0.5vh" }}
          color="dark"
          onClick={() => setIsAdding(!isAdding)}>
          Dodaj nauczyciela
        </Button>
      </Group>
      {isAdding && (
        <TeacherForm isAdding={isAdding} setIsAdding={setIsAdding} />
      )}
    </Container>
  )
}

export default SubjectContainer
