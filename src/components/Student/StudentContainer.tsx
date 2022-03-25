import { Container, Button } from "@mantine/core"
import TableView from "../TableView"
import "../../css/Student.css"
import { useState, useEffect, FunctionComponent } from "react"
import axios from "axios"
import StudentCreationForm from "./StudentCreationForm"

const StudentContainer: FunctionComponent = () => {
  const fakeStudents = [
    {
      first_name: "Andrzej",
      last_name: "Duda",
      class_number: 1,
    },
  ]

  const [isAdding, setIsAdding] = useState(false)
  const [students, setStudents] = useState(fakeStudents)
  useEffect(() => {
    const fetchStudents = async () => {
      const request = axios.get(`http://localhost:3567/api/student`)
      const data = await (await request).data
      setStudents(data)
    }
    fetchStudents()
  })

  return (
    <Container className="studentContainer">
      <TableView students={students} title="Uczniowie" variant="light" />
      <Button
        style={{ marginLeft: "0.75vw", marginBottom: "0.5vh" }}
        color="dark"
        onClick={() => setIsAdding(!isAdding)}>
        Dodać ucznia
      </Button>
      {isAdding && (
        <StudentCreationForm isAdding={isAdding} setIsAdding={setIsAdding} />
      )}
    </Container>
  )
}

export default StudentContainer
