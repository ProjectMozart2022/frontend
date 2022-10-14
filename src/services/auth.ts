import axios from "axios"
import { FirebaseOptions, initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

// TO EXTRACT THIS FROM THE CLIENT SIDE
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_AUTH_API_KEY as string,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN as string,
}

const app = initializeApp(firebaseConfig)
export const authService = getAuth(app)

export const logInWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  try {
    await signInWithEmailAndPassword(authService, email, password)
  } catch (err) {
    // TODO: handle error
    console.error(err)
  }
}

export const getToken = async () => {
  const jwt = await authService.currentUser?.getIdToken()
  if (jwt) {
    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`
    return true
  }
  return false
}

export const signOut = async () => {
  await authService.signOut()
}
