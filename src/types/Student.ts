import { Lesson } from "./Lesson"

export type Student = {
  id: number
  firstName: string
  lastName: string
  classNumber: number
  mainInstrument: string
  hasAllMandatorySubjectsAssigned: boolean
  hasITN: boolean
  lessons?: Lesson[]
}
