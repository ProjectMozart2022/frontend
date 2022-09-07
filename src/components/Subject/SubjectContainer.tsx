import { Button, Container, Group } from "@mantine/core"
import axios, { AxiosError } from "axios"
import { FunctionComponent, useEffect, useState } from "react"
import { setBearerToken } from "../../services/auth/setBearerToken"
import { signOut } from "../../services/auth/signOut"
import { Subject } from "../../types/Subject"
import { SubjectTable } from "../Tables/SubjectTable"
import { SubjectForm } from "./SubjectForm"

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
