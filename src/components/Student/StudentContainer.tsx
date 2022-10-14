import { Container } from "@mantine/core"
import { FunctionComponent } from "react"
import { useStudents } from "../../services/queries"
import { CustomTable } from "../Tables/CustomTable"
import "./css/Student.css"

const StudentContainer: FunctionComponent = () => {
  const { status, error: _error, data: students } = useStudents()

  // const fetchStudents = async () => {
  //   setIsLoading(true)
  //   try {
  //     await setBearerToken()
  //     const studentResponse = await axios.get<Student[]>(`admin/student`)
  //     setStudents(studentResponse.data)
  //     setIsLoading(false)
  //   } catch (error) {
  //     setError(error as string)
  //     setIsLoading(false)
  //     const aError = error as AxiosError
  //     if (aError.response?.status === 401) {
  //       await signOut()
  //     }
  //   }
  // }

  return (
    <Container className="studentContainer">
      {/* {status === "success" && students.length > 0 ? (
        <StudentTable setStudents={setStudents} students={students} />
      ) : null} */}
      {/* <Group position="center">
        <Button
          style={{ marginLeft: "0.75vw", marginBottom: "0.5vh" }}
          color="dark"
          onClick={() => setIsAdding(!isAdding)}>
          Dodaj ucznia
        </Button>
      </Group>
      {isAdding && (
        <StudentCreationForm
          setStudents={setStudents}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />
      )} */}
      <CustomTable />
    </Container>
  )
}

export default StudentContainer
