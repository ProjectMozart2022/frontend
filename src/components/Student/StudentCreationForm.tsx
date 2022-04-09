import React, { FunctionComponent, useState } from "react"
import { Container, TextInput, Group, Button } from "@mantine/core"
import { useForm } from "@mantine/form"
import { Student } from "../../types/Student"
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { Check, X } from "tabler-icons-react"
import { showNotification } from "../../service/notificationService"
import { auth } from "../../contexts/UserContext"

const URL = `https://mozart-backend.azurewebsites.net/api/student`

interface IProps {
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
}

const StudentCreationForm: FunctionComponent<IProps> = ({
  isAdding,
  setIsAdding,
}) => {
  const notifications = useNotifications()

  const studentForm = useForm<Student>({
    initialValues: {
      firstName: "",
      lastName: "",
      classNumber: 1,
    },
    validate: (values) => ({
      class_number: /[1-6]{1}/.test(`${values.classNumber}`)
        ? null
        : "Nieprawidłowa klasa",
      first_name: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.firstName)
        ? null
        : "Nieprawidłowa imię",
      last_name: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.lastName)
        ? null
        : "Nieprawidłowa nazwisko",
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

  const onSubmit = async (studentData: Student) => {
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

  return (
    <Container>
      <form onSubmit={studentForm.onSubmit(onSubmit)}>
        <TextInput
          required
          type="text"
          label="Imię ucznia"
          placeholder="Podaj imie ucznia"
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
        <Group
          position="center"
          style={{ marginTop: "0.5vh", marginBottom: "0.5vh" }}>
          <Button type="submit" color="dark">
            Dodaj ucznia
          </Button>
        </Group>
      </form>
    </Container>
  )
}

export default StudentCreationForm
