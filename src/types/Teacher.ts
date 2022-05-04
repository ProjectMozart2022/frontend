import { Lesson } from "./Lesson"

export type Teacher = {
  firebaseId: string
  firstName: string
  lastName: string
  email: string
  password: string
  lessons: Lesson[]
}
