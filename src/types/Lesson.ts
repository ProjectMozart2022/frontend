import { Student } from "./Student"
import { Subject } from "./Subject"
import { Teacher } from "./Teacher"

export type Lesson = {
  student: Student
  teacher: Teacher
  subject: Subject
}
