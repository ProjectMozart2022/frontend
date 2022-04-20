import { useState, FunctionComponent } from "react"
import { TextInput, Button, Group, Box } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { Check, X } from "tabler-icons-react"
import { showNotification } from "../../service/notificationService"
import { TeacherRequest } from "../../types/TeacherRequest"
import { auth } from "../../contexts/UserContext"
import {
  createUserWithEmailAndPassword,
  UserCredential,
  updateProfile,
} from "firebase/auth"

export const TeacherForm: FunctionComponent = () => {
  const URL = "https://mozart-backend.azurewebsites.net/api/admin/teacher"
  const notifications = useNotifications()
  const [error, setError] = useState("")

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

  const handleSubmit = (teacherData: TeacherRequest) => {
    const getJWT = async () => {
      return await auth.currentUser?.getIdToken()
    }
    const jwt = getJWT()
    createUserWithEmailAndPassword(
      auth,
      teacherData.email,
      teacherData.password
    )
      .then(
        async (res) =>
          await setDisplayName(res, teacherData.firstName, teacherData.lastName)
      )
      .catch((err) => setError(err.message))
    axios
      .post(URL, teacherData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
          "Allow-Origin": "*",
        },
      })
      .then((res) => console.log(res))
      .catch((err) => setError(err.message))
    showNotification(notifications, notificationObject)
  }

  const setDisplayName = async (
    user: UserCredential,
    firstName: string,
    lastName: string
  ) => {
    return await updateProfile(user.user, {
      displayName: `${firstName} ${lastName}`,
    })
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <Group position="center">
        <h4>Dodaj nauczyciela</h4>
      </Group>
      <form onSubmit={teacherForm.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Email nauczyciela"
          placeholder="Email nauczyciela"
          {...teacherForm.getInputProps("email")}
        />

        <TextInput
          required
          type="password"
          label="Hasło nauczyciela"
          placeholder="Hasło nauczyciela"
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
