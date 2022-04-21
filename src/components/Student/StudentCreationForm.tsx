import React, { FunctionComponent, useState } from "react"
import { TextInput, Group, Button, Box } from "@mantine/core"
import { useForm } from "@mantine/form"
import "./css/Student.css"
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { Check, X } from "tabler-icons-react"
import { showNotification } from "../../service/notificationService"
import { auth } from "../../contexts/UserContext"

const URL = `https://mozart-backend.azurewebsites.net/api/admin/student`

interface IProps {
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
}

type StudentFormType = {
  firstName: string
  lastName: string
  classNumber: number
}

const StudentCreationForm: FunctionComponent<IProps> = ({
  isAdding,
  setIsAdding,
}) => {
  const notifications = useNotifications()

  const studentForm = useForm<StudentFormType>({
    initialValues: {
      firstName: "",
      lastName: "",
      classNumber: 1,
    },
    validate: (values) => ({
      classNumber: /[1-6]{1}/.test(`${values.classNumber}`)
        ? null
        : "Nieprawidłowy identyfikator klasy",
      firstName: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.firstName)
        ? null
        : "Nieprawidłowe imię",
      lastName: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.lastName)
        ? null
        : "Nieprawidłowe nazwisko",
    }),
  })
  const [error, setError] = useState("")
  const notificationObject = {
    title: `${
      error ? `Nie udało się stworzyć ucznia!` : "Udało stworzyć się ucznia!"
    }`,
    autoClose: 3000,
    icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
    color: error?.length > 0 ? "red" : "green",
    message: error
      ? `Nie udało się stworzyć ucznia ${studentForm.values.firstName} ${studentForm.values.lastName}`
      : `Udało się stworzyć ucznia ${studentForm.values.firstName} ${studentForm.values.lastName}`,
  }

  const onSubmit = async (studentData: StudentFormType) => {
    setIsAdding(!isAdding)
    const jwt = await auth.currentUser?.getIdToken()
    axios
      .post(URL, studentData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
          "Allow-Origin": "*",
        },
      })
      .catch((err) => setError(err.message))
    showNotification(notifications, notificationObject)
  }

  const buttonStyle = { marginTop: "0.5vh", marginBottom: "0.5vh" }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto" className="student-container">
      <form onSubmit={studentForm.onSubmit(onSubmit)}>
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
        <TextInput
          required
          type="number"
          label="Klasa ucznia"
          placeholder="Podaj nazwisko ucznia"
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
