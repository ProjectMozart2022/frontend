import { Container, Button } from "@mantine/core"
import TableView from "../TableView"
import "../../css/Student.css"
import { useState, useEffect, FunctionComponent } from "react"
import axios from "axios"
import StudentCreationForm from "./StudentCreationForm"

const StudentContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [students, setStudents] = useState([])

  useEffect(() => {
    const fetchStudents = async () => {
      const response = axios
        .get(`http://localhost:4567/api/student`, {
          headers: {
            "Content-Type": "application/json",
            "Allow-Origin": "*",
          },
        })
        .then((res) => setStudents(res.data))
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
