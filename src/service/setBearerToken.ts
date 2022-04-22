import axios from "axios"
import { auth } from "../contexts/UserContext"

export const setBearerToken = async () => {
  const jwt = await auth.currentUser?.getIdToken()
  if (jwt) {
    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`
  }
}
