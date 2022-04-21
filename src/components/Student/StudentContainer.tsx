import "./css/Student.css"
import axios, { AxiosError } from "axios"
import StudentCreationForm from "./StudentCreationForm"
import { StudentTable, StudentTableProps } from "../Table/StudentTable"
import { Container, Button, Group } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { Student } from "../../types/Student"
import { signOut } from "../../service/signOut"
import { setBearerToken } from "../../service/setBearerToken"

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

  const tableData: StudentTableProps = {
    data: students.map((student) => {
      const studentData = {
        ...student,
        classNumber: student.classNumber.toString(),
      }
      return studentData
    }),
  }

  return (
    <Container className="studentContainer">
      {/* <StudentTable students={students} title="Uczniowie" variant="light" /> */}
      {!isLoading ? <StudentTable data={tableData.data}></StudentTable> : null}
      <Group position="center">
        <Button
          style={{ marginLeft: "0.75vw", marginBottom: "0.5vh" }}
          color="dark"
          onClick={() => setIsAdding(!isAdding)}>
          Dodaj ucznia
        </Button>
      </Group>
      {isAdding && (
        <StudentCreationForm isAdding={isAdding} setIsAdding={setIsAdding} />
      )}
    </Container>
  )
}

export default StudentContainer
