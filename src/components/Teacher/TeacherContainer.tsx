import { TeacherTable } from "../Table/TeacherTable"
import axios from "axios"
import { TeacherForm } from "./TeacherForm"
import { Container, Button, Group } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { TeacherRequest } from "../../types/TeacherRequest"

const SubjectContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [teachers, setTeachers] = useState<TeacherRequest[]>([])
  const [, setError] = useState("")

  const fetchTeachers = async () => {
    setIsLoading(true)
    try {
      const teachersResponse = await axios.get<TeacherRequest[]>(`admin/teacher`,)
      setTeachers(teachersResponse.data)
      setIsLoading(false)
    } catch (error) {
      setError(error as string)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchTeachers()
  }, [])

  return (
    <Container className="studentContainer">
      {!isLoading ? <TeacherTable data={teachers}></TeacherTable> : null}
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
