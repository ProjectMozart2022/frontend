import React, { useEffect, useState } from "react"
import { Button, Group, Box, MultiSelect } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { showNotification } from "../../service/notificationService"
import { Check, X } from "tabler-icons-react"
import { Subject } from "../../types/Subject"
import { Student } from "../../types/Student"
import { TeacherRequest } from "../../types/TeacherRequest"
import { auth } from "../../contexts/UserContext"

type LessonFormIProps = {
  subject: Subject | undefined
  student: Student | undefined
  teacher: TeacherRequest | undefined
}

export const LessonForm: React.FC = () => {
  const URL = "https://mozart-backend.azurewebsites.net/api/admin/"
  let jwt: string | undefined
  const notifications = useNotifications()
  const [error, setError] = useState("")
  const [subject, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<TeacherRequest[]>([])
  const fetchDefault = async () => {
    try {
      jwt = await auth.currentUser?.getIdToken()
      const headers = {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
        "Allow-Origin": "*",
      }
      const subjectResponse = await axios.get<Subject[]>(URL + "subject", {headers: headers})
      const studentResponse = await axios.get<Student[]>(URL + "student", {headers: headers})
      const teacherResponse = await axios.get<TeacherRequest[]>(
        URL + "teacher",
        {headers: headers}
      )
      setStudents(studentResponse.data)
      setTeachers(teacherResponse.data)
      setSubjects(subjectResponse.data)
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    fetchDefault()
  }, [])

  const lessonForm = useForm<LessonFormIProps>({
    initialValues: {
      student: undefined,
      teacher: undefined,
      subject: undefined,
    },

    validate: (values) => ({}),
  })

  const notificationObject = {
    title: `${
      error ? `Nie udało się dodać profilu!` : "Udało się dodać profil!"
    }`,
    autoClose: 3000,
    icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
    color: error?.length > 0 ? "red" : "green",
    message: error
      ? `Nie udało się dodać lekcji dla nauczyciela ${lessonForm.values.teacher?.firstName} z uczniem ${lessonForm.values.student?.firstName} z profilem ${lessonForm.values.subject?.name}`
      : `Udało się dodać lekcje dla nauczyciela${lessonForm.values.teacher?.firstName} z uczniem ${lessonForm.values.student?.firstName} z profilem ${lessonForm.values.subject?.name}`,
  }

  const handleSubmit = (lessonData: LessonFormIProps) => {
    const payload: LessonFormIProps = {
      ...lessonData,
    }
    const headers = {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
      "Allow-Origin": "*",
    }
    axios
      .post(URL + "lesson", payload, {
        headers: headers
      })
      .catch((err) => setError(err.message))
    showNotification(notifications, notificationObject)
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={lessonForm.onSubmit(handleSubmit)}>
        <MultiSelect
          required
          label="Wybierz ucznia"
          placeholder="uczeń"
          data={students!
            .map((student) => {
              return (
                student.firstName +
                " " +
                student.lastName +
                " " +
                student.classNumber
              )
            })}
          searchable
          {...lessonForm.getInputProps("student")}
        />

        <MultiSelect
          required
          label="Wybierz nauczyciela"
          placeholder="nauczyciel"
          data={teachers!.map((teacher) => {
            return teacher.firstName + " " + teacher.lastName
          })}
          searchable
          {...lessonForm.getInputProps("teacher")}
        />

        <MultiSelect
          required
          label="Wybierz przedmiot"
          placeholder="przedmiot"
          data={subject!
            .map((subject) => {
              return subject.name + " " + subject.lessonLength
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
