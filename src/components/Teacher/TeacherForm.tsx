import React, { useState } from "react"
import { Teacher } from "../../types/Teacher"
import { TextInput, Button, Group, Box } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { Check } from "tabler-icons-react"
import { showNotification } from "../../service/notificationService"

export const TeacherForm: React.FC = () => {
  const URL = "http://localhost:4567/api/teacher"
  const notifications = useNotifications()
  const [error, setError] = useState("")

  const teacherForm = useForm<Teacher>({
    initialValues: {
      firstName: "",
      lastName: "",
    },

    validate: (values) => ({
      firstName: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.firstName)
        ? null
        : "Niepoprawne imię",
      lastName: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.lastName)
        ? null
        : "Niepoprawne nazwisko",
    }),
  })

  const notificationObject = {
    title: `${
      error
        ? `Nie udało się dodać nauczyciela!`
        : "Udało się dodać nauczyciela!"
    }`,
    autoClose: 3000,
    icon: <Check size={18} />,
    color: "green",
    message: error
      ? `Nie udało się dodać nauczyciela ${teacherForm.values.firstName} ${teacherForm.values.lastName}`
      : `Udało się dodać nauczyciela ${teacherForm.values.firstName} ${teacherForm.values.lastName}`,
  }

  const handleSubmit = (teacherData: Teacher) => {
    axios
      .post(URL, teacherData, {
        headers: {
          "Content-Type": "application/json",
          "Allow-Origin": "*",
        },
      })
      .catch((err) => setError(err.message))
    showNotification(notifications, notificationObject)
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={teacherForm.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Imię nauczyciela"
          placeholder="Imię"
          {...teacherForm.getInputProps("firstName")}
        />

        <TextInput
          required
          label="Nazwisko nauczyciela"
          placeholder="Nazwisko"
          {...teacherForm.getInputProps("lastName")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Dodaj nauczyciela</Button>
        </Group>
      </form>
    </Box>
  )
}
