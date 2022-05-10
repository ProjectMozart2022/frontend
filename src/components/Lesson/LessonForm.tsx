import { useEffect, useState, FunctionComponent } from "react"
import { Button, Group, Box, Select } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios, { AxiosError } from "axios"
import { useNotifications } from "@mantine/notifications"
import { showNotification } from "../../services/notificationService"
import { Check, X } from "tabler-icons-react"
import { Subject } from "../../types/Subject"
import { Student } from "../../types/Student"
import { Teacher } from "../../types/Teacher"
import { signOut } from "../../services/signOut"
import { setBearerToken } from "../../services/setBearerToken"
import { ITN } from "../../types/ITN"
import { CreateItnModal } from "../modals/CreateItnModal"

type LessonFormIProps = {
  subject: string
  student: string
  teacher: string
}

export const LessonForm: FunctionComponent = () => {
  const notifications = useNotifications()
  const [error, setError] = useState("")
  const [subject, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [itn, setItn] = useState<ITN>()
  const fetchDefault = async () => {
    try {
      await setBearerToken()
      // zamiast robić trzy responsy można pomyśleć nad Promise.all
      // później wziąć to w jeden callback tak żeby wszystkie wykonywały się na raz
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
      // https://stackoverflow.com/questions/52669596/promise-all-with-axios
      const subjectResponse = await axios.get<Subject[]>(`admin/subject`)
      const studentResponse = await axios.get<Student[]>(`admin/student`)
      const teacherResponse = await axios.get<Teacher[]>(`admin/teacher`)
      setStudents(studentResponse.data)
      setTeachers(teacherResponse.data)
      setSubjects(subjectResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  useEffect(() => {
    void fetchDefault()
  }, [])

  const lessonForm = useForm<LessonFormIProps>({
    initialValues: {
      student: "",
      teacher: "",
      subject: "",
    },

    validate: (values) => ({
      student: values.student === undefined ? `Wybierz studenta` : null,
      teacher: values.teacher === undefined ? `Wybierz nauczyciela` : null,
      subject: values.subject === undefined ? `Wybierz przedmiot` : null,
    }),
  })

  const notificationObject = {
    title: `${
      error ? `Nie udało się dodać lekcji!` : "Udało się dodać lekcje!"
    }`,
    autoClose: 3000,
    icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
    color: error?.length > 0 ? "red" : "green",
    message: error ? `Nie udało się dodać lekcji` : `Udało się dodać lekcje`,
  }

  const handleSubmit = async (lessonData: LessonFormIProps) => {
    const { subject, student, teacher } = lessonData
    // TODO: error handling
    try {
      await axios.post(
        `admin/lesson?studentId=${student}&teacherId=${teacher}&subjectId=${subject}`
      )
    } catch (error) {
      const aError = error as AxiosError
      setError(error as string)
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    showNotification(notifications, notificationObject)
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={lessonForm.onSubmit(handleSubmit)}>
        <Select
          required
          label="Wybierz ucznia"
          placeholder="uczeń"
          data={students.map((student) => {
            return {
              value: student.id.toString(),
              label: `${student.firstName} ${student.lastName} ${student.classNumber}`,
            }
          })}
          nothingFound="ni ma"
          searchable
          clearable
          {...lessonForm.getInputProps("student")}
        />

        <Select
          required
          label="Wybierz nauczyciela"
          placeholder="nauczyciel"
          data={teachers.map((teacher) => {
            return {
              value: teacher?.firebaseId,
              label: `${teacher.firstName} ${teacher.lastName}`,
            }
          })}
          nothingFound="ni ma"
          searchable
          clearable
          {...lessonForm.getInputProps("teacher")}
        />

        {itn ? (
          <Select label="ITN" disabled data={[itn.name]} value={itn.name} />
        ) : (
          <Select
            required
            label="Wybierz przedmiot"
            placeholder="przedmiot"
            data={subject.map((subject) => {
              return {
                value: subject.id.toString(),
                label: `${subject.name} ${subject.lessonLength}`,
              }
            })}
            nothingFound="ni ma"
            searchable
            clearable
            {...lessonForm.getInputProps("subject")}
          />
        )}

        <Group position="right" mt="md">
          <CreateItnModal setItn={setItn} />
          {/* <Button color="red" disabled>
            Stwórz ITN
          </Button> */}
          <Button color="dark" type="submit">
            Dodaj lekcje
          </Button>
        </Group>
      </form>
    </Box>
  )
}
