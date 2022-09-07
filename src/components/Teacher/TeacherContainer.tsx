import { Button, Container, Group } from "@mantine/core"
import axios, { AxiosError } from "axios"
import { FunctionComponent, useEffect, useState } from "react"
import { setBearerToken, signOut } from "../../services/auth"
import { Teacher } from "../../types/Teacher"
import { TeacherTable } from "../Tables/TeacherTable"
import { TeacherForm } from "./TeacherForm"

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
      setTeachers(
        teachersResponse.data.map((teacher) => {
          return {
            ...teacher,
            actualNumOfHours:
              teacher.lessons.reduce(
                (acc, value) => acc + value.subject.lessonLength,
                0.0
              ) / 60,
          }
        })
      )
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

  return (
    <Container className="studentContainer">
      {!isLoading && teachers.length > 0 ? (
        <TeacherTable setTeachers={setTeachers} teachers={teachers} />
      ) : null}
      <Group position="center">
        <Button
          style={{ marginLeft: "0.75vw", marginBottom: "0.5vh" }}
          color="dark"
          onClick={() => setIsAdding(!isAdding)}>
          Dodaj nauczyciela
        </Button>
      </Group>
      {isAdding && (
        <TeacherForm
          setTeachers={setTeachers}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />
      )}
    </Container>
  )
}

export default SubjectContainer
