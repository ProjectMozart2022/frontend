import StudentTable from "./StudentTable"
import "./css/Student.css"
import axios from "axios"
import StudentCreationForm from "./StudentCreationForm"
import { Container, Button, Group } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { useFirebaseAuth, auth } from "../../contexts/UserContext"

const StudentContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [students, setStudents] = useState([])
  const user = useFirebaseAuth()
  const [, setError] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      const jwt = await auth.currentUser?.getIdToken()
      axios
        .get(`https://mozart-backend.azurewebsites.net/api/admin/student`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => setStudents(res.data))
        .catch((err) => setError(err.message))
    }
    fetchStudents()
  }, [user])

  return (
    <Container className="studentContainer">
      <StudentTable students={students} title="Uczniowie" variant="light" />
      <Group position="center">
        <Button
          style={{ marginLeft: "0.75vw", marginBottom: "0.5vh" }}
          color="dark"
          onClick={() => setIsAdding(!isAdding)}>
          Dodać ucznia
        </Button>
      </Group>
      {isAdding && (
        <StudentCreationForm isAdding={isAdding} setIsAdding={setIsAdding} />
      )}
    </Container>
  )
}

export default StudentContainer
