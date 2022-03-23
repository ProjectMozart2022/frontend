import { Container } from "react-bootstrap"
import TableView from "./TableView"
import "../css/Student.css"
import { useState, useEffect, FunctionComponent } from "react"
import axios from "axios"

const StudentContainer: FunctionComponent = () => {
  const [students, setStudents] = useState([])

  const fakeStudents = [
    {
      first_name: "Andrzej",
      last_name: "Duda",
      class_number: 1,
    },
  ]

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
      <TableView students={fakeStudents} title="Uczniowie" />
    </Container>
  )
}

export default StudentContainer
