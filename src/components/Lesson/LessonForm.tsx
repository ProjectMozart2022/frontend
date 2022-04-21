import { useEffect, useState, FunctionComponent } from "react"
import { Button, Group, Box, MultiSelect } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { showNotification } from "../../service/notificationService"
import { Check, X } from "tabler-icons-react"
import { Subject } from "../../types/Subject"
import { Student } from "../../types/Student"
import { TeacherRequest } from "../../types/TeacherRequest"

type LessonFormIProps = {
  subject: Subject | undefined
  student: Student | undefined
  teacher: TeacherRequest | undefined
}

export const LessonForm: FunctionComponent = () => {
  const notifications = useNotifications()
  const [error, setError] = useState("")
  const [subject, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<TeacherRequest[]>([])
  const fetchDefault = async () => {
    try {
      // zamiast robić trzy responsy można pomyśleć nad Promise.all
      // później wziąć to w jeden callback tak żeby wszystkie wykonywały się na raz
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
      // https://stackoverflow.com/questions/52669596/promise-all-with-axios
      const subjectResponse = await axios.get<Subject[]>(`admin/subject`)
      const studentResponse = await axios.get<Student[]>(`admin/student`)
      const teacherResponse = await axios.get<TeacherRequest[]>(`admin/teacher`)
      setStudents(studentResponse.data)
      setTeachers(teacherResponse.data)
      setSubjects(subjectResponse.data)
    } catch (error) {
      console.log(error) 
    }
  }

  useEffect(() => {
    void fetchDefault()
  })

  const lessonForm = useForm<LessonFormIProps>({
    initialValues: {
      student: undefined,
      teacher: undefined,
      subject: undefined,
    },

    validate: (values) => ({
      student: values.student !== undefined ? `Wybierz studenta` : null,
      teacher: values.teacher !== undefined ? `Wybierz nauczyciela` : null,
      subject: values.subject !== undefined ? `Wybierz przedmiot` : null,
    }),
  })

  const notificationObject = {
    title: `${
      error ? `Nie udało się dodać profilu!` : "Udało się dodać profil!"
    }`,
    autoClose: 3000,
    icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
    color: error?.length > 0 ? "red" : "green",
    message: error
      ? `Nie udało się dodać lekcji`
      : `Udało się dodać lekcje`,
  }

  const handleSubmit = async (lessonData: LessonFormIProps) => {
    const payload: LessonFormIProps = {
      ...lessonData,
    }

    await axios.post("admin/lesson", payload)
    // TODO: error handling
    // setError(error as string)
    showNotification(notifications, notificationObject)
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={lessonForm.onSubmit(handleSubmit)}>
        <MultiSelect
          required
          label="Wybierz ucznia"
          placeholder="uczeń"
          data={students.map((student) => {
            return `${student.firstName} ${student.lastName} ${student.classNumber}`
          })}
          searchable
          {...lessonForm.getInputProps("student")}
        />

        <MultiSelect
          required
          label="Wybierz nauczyciela"
          placeholder="nauczyciel"
          data={teachers.map((teacher) => {
            return `${teacher.firstName} ${teacher.lastName}`
          })}
          searchable
          {...lessonForm.getInputProps("teacher")}
        />

        <MultiSelect
          required
          label="Wybierz przedmiot"
          placeholder="przedmiot"
          data={subject.map((subject) => {
            return `${subject.name} ${subject.lessonLength}`
          })}
          searchable
          {...lessonForm.getInputProps("subject")}
        />

        <Group position="right" mt="md">
          <Button color="dark" type="submit">
            Dodaj lekcje
          </Button>
        </Group>
      </form>
    </Box>
  )
}
