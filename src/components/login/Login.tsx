import {
  Button,
  Center,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"
import { authService, logInWithEmailAndPassword } from "../../services/auth"
import { FirebaseUser } from "../../types/FirebaseUser"
import { useLoginStyles } from "./styles/loginStyles"

const Login = () => {
  const { classes } = useLoginStyles()
  const navigate = useNavigate()
  const [user, loading, error] = useAuthState(authService)

  const loginForm = useForm<FirebaseUser>({
    initialValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (userData: FirebaseUser) => {
    await logInWithEmailAndPassword({
      email: userData.email,
      password: userData.password,
    })
  }

  useEffect(() => {
    if (loading) {
      // trigger a loading screen
      return
    }
    console.log(user)
    if (user) navigate("/uczniowie")
  }, [user, loading, navigate])

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <form onSubmit={loginForm.onSubmit(handleSubmit)}>
          <Title
            order={2}
            className={classes.title}
            align="center"
            mt="md"
            mb={50}>
            Logowanie
          </Title>
          <TextInput
            required
            className={classes.input}
            label="Email"
            placeholder="Podaj email"
            {...loginForm.getInputProps("email")}
          />
          <PasswordInput
            required
            className={classes.input}
            label="Hasło"
            placeholder="Podaj hasło"
            {...loginForm.getInputProps("password")}
          />
          <Center>
            <Button radius="md" color="gray" type="submit">
              Zaloguj
            </Button>
          </Center>
        </form>
      </Paper>
    </div>
  )
}

export default Login
