import { SubjectTable } from "../Tables/SubjectTable"
import axios, { AxiosError } from "axios"
import { SubjectForm } from "./SubjectForm"
import { Container, Button, Group } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { Subject } from "../../types/Subject"
import { signOut } from "../../services/signOut"
import { setBearerToken } from "../../services/setBearerToken"

const SubjectContainer: FunctionComponent = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [, setError] = useState("")

  const fetchSubjects = async () => {
    setIsLoading(true)
    try {
      await setBearerToken()
      const subjectResponse = await axios.get<Subject[]>(`admin/subject`)
      setSubjects(subjectResponse.data)
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
    void fetchSubjects()
  }, [])

  return (
    <Container className="studentContainer">
      {!isLoading && subjects.length > 0 ? (
        <SubjectTable setSubjects={setSubjects} subjects={subjects} />
      ) : null}
      <Group position="center">
        <Button
          style={{ marginLeft: "0.75vw", marginBottom: "0.5vh" }}
          color="dark"
          onClick={() => setIsAdding(!isAdding)}>
          Dodaj przedmiot
        </Button>
      </Group>
      {isAdding && (
        <SubjectForm
          setSubjects={setSubjects}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />
      )}
    </Container>
  )
}

export default SubjectContainer
