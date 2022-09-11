import axios from "axios"
import { FirebaseOptions, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// TO EXTRACT THIS FROM THE CLIENT SIDE
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_AUTH_API_KEY as string,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN as string,
}

const app = initializeApp(firebaseConfig)

export const authService = getAuth(app)

export const setBearerToken = async () => {
  const auth = getAuth()
  const jwt = await auth.currentUser?.getIdToken()
  if (jwt) {
    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`
  }
}

export const getBearerToken = async () => {
  const auth = getAuth()
  const jwt = await auth.currentUser?.getIdToken()
  return jwt
}

export const signOut = async () => {
  const auth = getAuth()
  await auth.signOut()
}
