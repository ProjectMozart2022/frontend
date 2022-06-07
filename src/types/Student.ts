import { Lesson } from "./Lesson"

export type Student = {
  id: number
  firstName: string
  lastName: string
  classNumber: number
  lessons: Lesson[]
  mainInstrument: string
  hasAllMandatorySubjectsAssigned: boolean
  hasITN: boolean
}
