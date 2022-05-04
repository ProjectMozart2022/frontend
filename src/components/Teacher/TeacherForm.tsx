import { useState, FunctionComponent } from "react"
import { TextInput, Button, Group, Box } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios, { AxiosError } from "axios"
import { useNotifications } from "@mantine/notifications"
import { Check, X } from "tabler-icons-react"
import { showNotification } from "../../services/notificationService"
import { signOut } from "../../services/signOut"
import { Teacher } from "../../types/Teacher"

type TeacherFormType = {
  firstName: string
  lastName: string
  email: string
  password: string
}
interface IProps {
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
}

export const TeacherForm: FunctionComponent<IProps> = ({
  setTeachers,
  isAdding,
  setIsAdding,
}) => {
  const notifications = useNotifications()
  const [error, setError] = useState("")

  const teacherForm = useForm<TeacherFormType>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
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
    icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
    color: error?.length > 0 ? "red" : "green",
    message: error
      ? `Nie udało się dodać nauczyciela ${teacherForm.values.firstName} ${teacherForm.values.lastName}!`
      : `Udało się dodać nauczyciela ${teacherForm.values.firstName} ${teacherForm.values.lastName}!`,
  }

  const handleSubmit = async (teacherData: TeacherFormType) => {
    try {
      setIsAdding(!isAdding)
      await axios.post(`admin/teacher`, teacherData)
      await fetchTeachers()
    } catch (error) {
      setIsAdding(!isAdding)
      const aError = error as AxiosError
      setError(aError.message)
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    setIsAdding(!isAdding)
    // TODO: error handling
    showNotification(notifications, notificationObject)
  }

  const fetchTeachers = async () => {
    try {
      const teacherResponse = await axios.get<Teacher[]>(`admin/teacher`)
      setTeachers(teacherResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={teacherForm.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Email"
          placeholder="Email"
          {...teacherForm.getInputProps("email")}
        />

        <TextInput
          required
          type="password"
          label="Hasło"
          placeholder="Hasło"
          {...teacherForm.getInputProps("password")}
        />

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
          <Button type="submit" color="dark">
            Dodaj nauczyciela
          </Button>
        </Group>
      </form>
    </Box>
  )
}
