import "./css/Student.css"
import axios, { AxiosError } from "axios"
import StudentCreationForm from "./StudentForm"
import { StudentTable } from "../Tables/StudentTable"
import { Container, Button, Group } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { Student } from "../../types/Student"
import { signOut } from "../../services/signOut"
import { setBearerToken } from "../../services/setBearerToken"

const StudentContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [, setError] = useState("")

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      await setBearerToken()
      const studentResponse = await axios.get<Student[]>(`admin/student`)
      setStudents(studentResponse.data)
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
    void fetchStudents()
  }, [])

  return (
    <Container className="studentContainer">
      {!isLoading ? (
        <StudentTable
          setStudents={setStudents} 
          students={students}
        />
      ) : null}
      <Group position="center">
        <Button
          style={{ marginLeft: "0.75vw", marginBottom: "0.5vh" }}
          color="dark"
          onClick={() => setIsAdding(!isAdding)}>
          Dodaj ucznia
        </Button>
      </Group>
      {isAdding && (
        <StudentCreationForm setStudents={setStudents} isAdding={isAdding} setIsAdding={setIsAdding} />
      )}
    </Container>
  )
}

export default StudentContainer
