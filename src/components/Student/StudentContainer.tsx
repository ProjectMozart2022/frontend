import "./css/Student.css"
import axios from "axios"
import StudentCreationForm from "./StudentCreationForm"
import { StudentTable, StudentTableProps } from "../Table/StudentTable"
import { Container, Button, Group } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { auth } from "../../contexts/UserContext"
import { Student } from "../../types/Student"

const StudentContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [, setError] = useState("")

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const jwt = await auth.currentUser?.getIdToken()
      const studentResponse = await axios.get<Student[]>(
        `https://mozart-backend.azurewebsites.net/api/admin/student`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      setStudents(studentResponse.data)
      setIsLoading(false)
    } catch (error: any) {
      setError(error.toString())
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const tableData: StudentTableProps = {
    data: students.map((student) => {
      const studentData = {
        ...student,
        id: student.id.toString(),
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
