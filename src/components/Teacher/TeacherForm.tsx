import { useState, FunctionComponent } from "react"
import { TextInput, Button, Group, Box } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { Check, X } from "tabler-icons-react"
import { showNotification } from "../../services/notificationService"
import { TeacherRequest } from "../../types/TeacherRequest"
import { auth } from "../../contexts/UserContext"
import {
  createUserWithEmailAndPassword,
  UserCredential,
  updateProfile,
} from "firebase/auth"

interface IProps {
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
}

export const TeacherForm: FunctionComponent<IProps> = ({
  isAdding,
  setIsAdding,
}) => {
  const notifications = useNotifications()
  const [error] = useState("")

  const teacherForm = useForm<TeacherRequest>({
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

  const handleSubmit = async (teacherData: TeacherRequest) => {
    setIsAdding(!isAdding)
    const fireBaseResponse = await createUserWithEmailAndPassword(
      auth,
      teacherData.email,
      teacherData.password
    )
    await setDisplayName(
      fireBaseResponse,
      teacherData.firstName,
      teacherData.lastName
    )
    await axios.post(`admin/teacher`, teacherData)
    // TODO: error handling
    showNotification(notifications, notificationObject)
  }

  const setDisplayName = (
    user: UserCredential,
    firstName: string,
    lastName: string
  ) => {
    return updateProfile(user.user, {
      displayName: `${firstName} ${lastName}`,
    })
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
