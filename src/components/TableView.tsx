import { FC } from "react"
import { Container, Table } from "react-bootstrap"
import { Student } from "../types/Student"
import "../css/Student.css"

interface IProps {
  students: Student[]
  title: string
}

const TableView: FC<IProps> = ({ students, title }) => {
  if (!students) {
    return <Container></Container>
  }

  const headers = Object.entries(students[0])
    .filter(([k, v]) => !k.includes("is_present"))
    .map(([k, v]) => {
      const spittedKey = k.split("_")
      const capitalizeFirstLetter = (key: string) => {
        return key.charAt(0).toUpperCase() + key.slice(1)
      }
      return (
        capitalizeFirstLetter(`${spittedKey[0]} `) +
        spittedKey.slice(1).join(" ")
      )
    })

  return (
    <Container className="studentContainer" fluid>
      <h3 className="title">{title}</h3>
      <Table bordered striped>
        <thead>
          <tr>
            {headers.map((header) => {
              return <th key={header}>{header}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            return (
              <tr
                key={`${student.first_name}-${student.last_name}-${student.class_number}`}>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.class_number}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Container>
  )
}

export default TableView
