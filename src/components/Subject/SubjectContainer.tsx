import { SubjectTable, SubjectTableProps } from "../Table/SubjectTable"
import axios from "axios"
import { SubjectForm } from "./SubjectForm"
import { Container, Button, Group } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { Subject } from "../../types/Subject"

const SubjectContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [, setError] = useState("")

  const fetchSubjects = async () => {
    setIsLoading(true)
    try {
      const subjectResponse = await axios.get<Subject[]>(`admin/subject`)
      setSubjects(subjectResponse.data)
      setIsLoading(false)
    } catch (error) {
      setError(error as string)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchSubjects()
  }, [])

  const tableData: SubjectTableProps = {
    data: subjects.map((subject) => {
      const subjectData = {
        name: subject.name,
        lessonLength: subject.lessonLength.toString(),
        classRange: subject.classRange.toString(),
      }
      return subjectData
    }),
  }

  return (
    <Container className="studentContainer">
      {!isLoading ? <SubjectTable data={tableData.data}></SubjectTable> : null}
      <Group position="center">
        <Button
          style={{ marginLeft: "0.75vw", marginBottom: "0.5vh" }}
          color="dark"
          onClick={() => setIsAdding(!isAdding)}>
          Dodaj przedmiot
        </Button>
      </Group>
      {isAdding && (
        <SubjectForm isAdding={isAdding} setIsAdding={setIsAdding} />
      )}
    </Container>
  )
}

export default SubjectContainer
