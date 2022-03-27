import { FunctionComponent } from "react"
import { Container } from "@mantine/core"
import { Table } from "react-bootstrap"
import { Student } from "../types/Student"
import "../css/Student.css"

interface IProps {
  students: Student[]
  title: string
  variant: string
}

const TableView: FunctionComponent<IProps> = ({ students, title, variant }) => {
  if (!students) {
    return <Container></Container>
  }

  const mapFunction = (k: string) => {
    const capitalizeFirstLetter = (key: string) => {
      return key.charAt(0).toUpperCase() + key.slice(1)
    }
    let returnStr = ""
    for (let i = 0; i < k.length; i++) {
      if (k[i].match(/[A-Z]/)) {
        let char = k[i]
        let str = k.split(/[A-Z]/)
        returnStr = `${capitalizeFirstLetter(str[0])} ${char.toUpperCase()}${
          str[1]
        }`
      }
    }
    return returnStr
  }

  const filterFunction = (k: string) => {
    return !k.includes("isPresent") && !k.includes("id")
  }

  const headers = Object.keys(students[0])
    .filter((k) => filterFunction(k))
    .map((k) => mapFunction(k))

  return (
    <Container className="studentContainer">
      <h3 className="title">{title}</h3>
      <Table variant={variant} bordered striped hover>
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
                key={`${student.firstName}-${student.lastName}-${student.classNumber}`}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.classNumber}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Container>
  )
}

export default TableView
