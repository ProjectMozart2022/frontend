import TableView from "../TableView"
import "../../css/Student.css"
import axios from "axios"
import StudentCreationForm from "./StudentCreationForm"
import { Container, Button } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"

const StudentContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [students, setStudents] = useState([])
  const [, setError] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      axios
        .get(`https://mozart-backend.azurewebsites.net/api/admin/student`, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => setStudents(res.data))
        .catch((err) => setError(err.message))
    }
    fetchStudents()
  }, [])

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
