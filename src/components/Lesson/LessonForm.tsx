import React, { useEffect, useState } from "react"
import { Button, Group, Box, MultiSelect } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { showNotification } from "../../service/notificationService"
import { Check, X } from "tabler-icons-react"
import { Profile } from "../../types/Profile"
import { Student } from "../../types/Student"
import { Teacher } from "../../types/Teacher"

type LessonFormIProps = {
  profile: Profile | undefined
  student: Student | undefined
  teacher: Teacher | undefined
}

export const LessonForm: React.FC = () => {
  const URL = "https://mozart-backend.azurewebsites.net/api/admin/"
  const notifications = useNotifications()
  const [error, setError] = useState("")
  const [profiles, setProfiles] = useState<Profile[]>()
  const [students, setStudents] = useState<Student[]>()
  const [teachers, setTeacher] = useState<Teacher[]>()
  const fetchDefault = async () => {
    let profiles: Profile[] | undefined = undefined
    let students: Student[] | undefined = undefined
    let teachers: Teacher[] | undefined = undefined
    try {
      const headers = {
          "Content-Type": "application/json",
          "Allow-Origin": "*",
      }
      const profileResponse = await axios.get<Profile[]>(URL + "profile", {headers: headers})
      const studentResponse = await axios.get<Student[]>(URL + "student", {headers: headers})
      const teacherResponse = await axios.get<Teacher[]>(URL + "teacher", {headers: headers})
      profiles = profileResponse.data
      students = studentResponse.data
      teachers = teacherResponse.data
    } catch (error) {
      console.log(error)
    }
    setProfiles(profiles)
    setStudents(students)
    setTeacher(teachers)
  }
  useEffect(() => {
    fetchDefault()
  }, [])

  const lessonForm = useForm<LessonFormIProps>({
    initialValues: {
      profile: profiles![0],
      student: students![0],
      teacher: teachers![0],
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
      ? `Nie udało się dodać lekcji dla nauczyciela ${lessonForm.values.teacher?.firstName} z uczniem ${lessonForm.values.student?.firstName} z profilem ${lessonForm.values.profile?.name}`
      : `Udało się dodać lekcje dla nauczyciela${lessonForm.values.teacher?.firstName} z uczniem ${lessonForm.values.student?.firstName} z profilem ${lessonForm.values.profile?.name}`,
  }

  const handleSubmit = (lessonData: LessonFormIProps) => {
    const payload: LessonFormIProps = {
      ...lessonData,
    }
    axios
      .post(URL + "lesson", payload, {
        headers: {
          "Content-Type": "application/json",
          "Allow-Origin": "*",
        },
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
            .filter((student) => {
              return lessonForm.values.profile?.classRange.includes(
                student.classNumber
              )
            })
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
          label="Wybierz profil"
          placeholder="profil"
          data={profiles!
            .filter((profile) => {
              return profile.classRange.includes(
                lessonForm.values.student?.classNumber!
              )
            })
            .map((profile) => {
              return profile.name + " " + profile.lessonLength
            })}
          searchable
          {...lessonForm.getInputProps("profile")}
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
