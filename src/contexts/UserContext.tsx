import {
  useContext,
  createContext,
  FunctionComponent,
  ReactNode,
  useState,
  useEffect,
} from "react"
import { initializeApp } from "firebase/app"
import { getAuth, User } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyA7zW5JVBpiGghTaEUa3FmjslP5fcR09Kk",
  authDomain: "mozart-poc.firebaseapp.com",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
)

type FirebaseContextType = {
  user: User | null
}

interface IProps {
  children: ReactNode
}

const UserContext: FunctionComponent<IProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const value = { user }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser)
    return unsubscribe
  }, [])

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    )
  }
  return context.user
}

export default UserContext
