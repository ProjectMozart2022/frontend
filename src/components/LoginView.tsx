import axios from "axios"
import { Box, Button, Center, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useNotifications } from "@mantine/notifications"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { Check, X } from "tabler-icons-react"
import { auth } from "../contexts/UserContext"
import { showNotification } from "../service/notificationService"
import { FirebaseUser } from "../types/FirebaseUser"

const URL = `https://mozart-backend.azurewebsites.net/api/login`

const LoginView = () => {
  const [error, setError] = useState("")
  const notifications = useNotifications()

  const notificationObject = {
    title:
      error?.length > 0 ? "Nie udało się zalogować!" : "Udało się zalogować!",
    autoClose: 3000,
    icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
    color: error?.length > 0 ? "red" : "green",
    message: error?.length ? `Nie udało zalogować!` : `Udało się zalogować!`,
  }

  const loginForm = useForm<FirebaseUser>({
    initialValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (userData: FirebaseUser) => {
    signInWithEmailAndPassword(auth, userData.email, userData.password)
      .then((user) => console.log(user.user))
      .catch((error) => setError(error.message))
    const jwt = await auth.currentUser?.getIdToken()
    const uid = auth.currentUser?.uid
    axios
      .get(`${URL}?uid=${uid}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => console.log(res))
      .catch((err) => setError(err.message))
    showNotification(notifications, notificationObject)
  }

  return (
    <Box style={{ maxWidth: 1500, margin: 10 }}>
      <Center>
        <h1>Logowanie</h1>
      </Center>
      <Box sx={{ maxWidth: 400 }} mx="auto">
        <form onSubmit={loginForm.onSubmit(onSubmit)}>
          <TextInput
            required
            style={{ padding: 10 }}
            label="Email"
            placeholder="Wpisz email"
            {...loginForm.getInputProps("email")}
          />
          <TextInput
            required
            type="password"
            label="Hasło"
            placeholder="Wpisz hasło"
            style={{ padding: 10 }}
            {...loginForm.getInputProps("password")}
          />
          <Center>
            <Button type="submit">Zaloguj</Button>
          </Center>
        </form>
      </Box>
    </Box>
  )
}

export default LoginView
