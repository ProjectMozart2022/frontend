import { Box, Button, Group, NumberInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios, { AxiosError } from "axios"
import React, { Dispatch, FunctionComponent, SetStateAction } from "react"
import { signOut } from "../../services/auth/signOut"
import { Student } from "../../types/Student"
import "./css/Student.css"

interface IProps {
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
  setStudents: Dispatch<SetStateAction<Student[]>>
}

export type StudentFormType = {
  firstName: string
  lastName: string
  classNumber: number
  mainInstrument: string
}

const StudentCreationForm: FunctionComponent<IProps> = ({
  setStudents,
  isAdding,
  setIsAdding,
}) => {
  const studentForm = useForm<StudentFormType>({
    initialValues: {
      firstName: "",
      lastName: "",
      classNumber: 1,
      mainInstrument: "SAX",
    },
    validate: (values) => ({
      firstName: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.firstName)
        ? null
        : "Nieprawidłowe imię",
      lastName: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.lastName)
        ? null
        : "Nieprawidłowe nazwisko",
    }),
  })
  // const [error] = useState("")
  // const notificationObject = {
  //   title: `${
  //     error ? `Nie udało się stworzyć ucznia!` : "Udało stworzyć się ucznia!"
  //   }`,
  //   autoClose: 3000,
  //   icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
  //   color: error?.length > 0 ? "red" : "green",
  //   message: error
  //     ? `Nie udało się stworzyć ucznia ${studentForm.values.firstName} ${studentForm.values.lastName}`
  //     : `Udało się stworzyć ucznia ${studentForm.values.firstName} ${studentForm.values.lastName}`,
  // }

  const handleSubmit = async (studentData: StudentFormType) => {
    try {
      setIsAdding(!isAdding)
      await axios.post(`admin/student`, studentData)
      await fetchStudents()
    } catch (error) {
      setIsAdding(!isAdding)
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    setIsAdding(!isAdding)
    // TODO: error handling (notification)
  }

  const fetchStudents = async () => {
    try {
      const studentResponse = await axios.get<Student[]>(`admin/student`)
      setStudents(studentResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  const buttonStyle = { marginTop: "0.5vh", marginBottom: "0.5vh" }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto" className="student-container">
      <form onSubmit={studentForm.onSubmit(handleSubmit)}>
        <TextInput
          required
          type="text"
          label="Imię ucznia"
          placeholder="Podaj imię ucznia"
          {...studentForm.getInputProps("firstName")}
        />
        <TextInput
          required
          type="text"
          label="Nazwisko ucznia"
          placeholder="Podaj nazwisko ucznia"
          {...studentForm.getInputProps("lastName")}
        />
        <NumberInput
          required
          type="number"
          label="Klasa ucznia"
          min={1}
          max={12}
          placeholder="Podaj numer klasy ucznia"
          {...studentForm.getInputProps("classNumber")}
        />
        <Group position="center" style={buttonStyle}>
          <Button type="submit" color="dark">
            Dodaj ucznia
          </Button>
        </Group>
      </form>
    </Box>
  )
}

export default StudentCreationForm
