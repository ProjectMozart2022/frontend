import { TeacherTable } from "../Table/TeacherTable"
import axios from "axios"
import { TeacherForm } from "./TeacherForm"
import { Container, Button, Group } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { auth } from "../../contexts/UserContext"
import { TeacherRequest } from "../../types/TeacherRequest"

const SubjectContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [teachers, setTeachers] = useState<TeacherRequest[]>([])
  const [, setError] = useState("")

  const fetchTeachers = async () => {
    setIsLoading(true)
    try {
      const jwt = await auth.currentUser?.getIdToken()
      const teachersResponse = await axios.get<TeacherRequest[]>(
        `https://mozart-backend.azurewebsites.net/api/admin/teacher`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      setTeachers(teachersResponse.data)
      setIsLoading(false)
    } catch (error: any) {
      setError(error.toString())
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
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
