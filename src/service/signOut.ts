import { auth } from "../contexts/UserContext"

export const signOut = async () => {
  await auth.signOut()
}
