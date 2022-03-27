import React, { FunctionComponent, useState } from "react"
import { Container, TextInput, Group, Button } from "@mantine/core"
import { useForm } from "@mantine/form"
import { Student } from "../../types/Student"
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { Check } from "tabler-icons-react"

const URL = `http://localhost:4567/api/student`

interface IProps {
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
}

const StudentCreationForm: FunctionComponent<IProps> = ({
  isAdding,
  setIsAdding,
}) => {
  const notifications = useNotifications()
  const [error, setError] = useState("")

  const studentForm = useForm<Student>({
    initialValues: {
      first_name: "",
      last_name: "",
      class_number: 1,
    },
    validate: (values) => ({
      class_number: /[1-6]{1}/.test(`${values.class_number}`)
        ? null
        : "Nieprawidłowa klasa",
      first_name: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.first_name)
        ? null
        : "Nieprawidłowa imię",
      last_name: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.last_name)
        ? null
        : "Nieprawidłowa nazwisko",
    }),
  })

  const onSubmit = (studentData: Student) => {
    setIsAdding(!isAdding)
    axios.post(URL, { studentData }).catch((err) => setError(err.message))
    notifications.showNotification({
      title: `${
        error ? `Nie udało się stworzyć ucznia!` : "Udało stworzyć się ucznia!"
      }`,
      autoClose: 3000,
      icon: <Check size={18} />,
      color: "green",
      message: error
        ? `Nie udało się stworzyć ucznia ${studentForm.values.first_name} ${studentForm.values.last_name}`
        : `Udało się stworzyć ucznia ${studentForm.values.first_name} ${studentForm.values.last_name}`,
    })
  }

  return (
    <Container>
      <form onSubmit={studentForm.onSubmit(onSubmit)}>
        <TextInput
          required
          type="text"
          label="Imię ucznia"
          placeholder="Podaj imie ucznia"
          {...studentForm.getInputProps("first_name")}
        />
        <TextInput
          required
          type="text"
          label="Nazwisko ucznia"
          placeholder="Podaj nazwisko ucznia"
          {...studentForm.getInputProps("last_name")}
        />
        <TextInput
          required
          type="number"
          label="Klasa ucznia"
          placeholder="Podaj nazwisko ucznia"
          {...studentForm.getInputProps("class_number")}
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
