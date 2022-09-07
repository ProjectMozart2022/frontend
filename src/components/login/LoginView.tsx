import {
  Button,
  Center,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { FirebaseUser } from "../../types/FirebaseUser"
import { useLoginStyles } from "./styles/loginStyles"

const LoginView = () => {
  const auth = getAuth()
  const { classes } = useLoginStyles()

  const loginForm = useForm<FirebaseUser>({
    initialValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (userData: FirebaseUser) => {
    await signInWithEmailAndPassword(auth, userData.email, userData.password)
  }

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
            placeholder="Wpisz email"
            {...loginForm.getInputProps("email")}
          />
          <PasswordInput
            required
            className={classes.input}
            label="Hasło"
            placeholder="Wpisz hasło"
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

export default LoginView
