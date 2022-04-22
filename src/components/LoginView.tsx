import { Box, Button, Center, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../contexts/UserContext"
import { FirebaseUser } from "../types/FirebaseUser"
import axios from "axios"

const LoginView = () => {

  const loginForm = useForm<FirebaseUser>({
    initialValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (userData: FirebaseUser) => {
    await signInWithEmailAndPassword(auth, userData.email, userData.password)
    // TODO: error handling
  }

  return (
    <Box style={{ maxWidth: 1500, margin: 10 }}>
      <Center>
        <h1>Logowanie</h1>
      </Center>
      <Box sx={{ maxWidth: 400 }} mx="auto">
        <form onSubmit={loginForm.onSubmit(handleSubmit)}>
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
