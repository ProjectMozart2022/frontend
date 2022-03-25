import React from "react"
import { Teacher } from "../types/Teacher"
import { TextInput, Button, Group, Box } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios from "axios"

export const TeacherForm: React.FC = () => {
  const URL = "http://localhost:3567/api/teacher"

  const form = useForm<Teacher>({
    initialValues: {
      first_name: "",
      last_name: "",
    },

    validate: (values) => ({
      first_name: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.first_name)
        ? null
        : "Niepoprawne imię",
      last_name: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.last_name)
        ? null
        : "Niepoprawne nazwisko",
    }),
  })

  const handleSubmit = (teacherData: Teacher) => {
    const response: Promise<Teacher> = axios.post(URL, {teacherData})
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={form.onSubmit((handleSubmit))}>
        <TextInput
          required
          label="Imię nauczyciela"
          placeholder="Imię"
          {...form.getInputProps("first_name")}
        />

        <TextInput
          required
          label="Nazwisko nauczyciela"
          placeholder="Nazwisko"
          {...form.getInputProps("last_name")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Dodaj nauczyciela</Button>
        </Group>
      </form>
    </Box>
  )
}
