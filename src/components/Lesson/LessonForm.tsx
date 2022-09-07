import { Box, Button, Group, Select } from "@mantine/core"
import { useForm } from "@mantine/form"
import axios, { AxiosError } from "axios"
import { FunctionComponent, useState } from "react"
import { setBearerToken, signOut } from "../../services/auth"
import { Student } from "../../types/Student"
import { Subject } from "../../types/Subject"
import { Teacher } from "../../types/Teacher"

type LessonFormIProps = {
  subject: string
  student: string
  teacher: string
}

export const LessonForm: FunctionComponent = () => {
  const [_error, setError] = useState("")
  const [subject, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const fetchStudents = async () => {
    try {
      await setBearerToken()
      const studentResponse = await axios.get<Student[]>(`admin/student`)
      setStudents(studentResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  const fetchTeachers = async () => {
    try {
      await setBearerToken()
      const teacherResponse = await axios.get<Teacher[]>(`admin/teacher`)
      setTeachers(teacherResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  const fetchFilteredStudents = async () => {
    try {
      await setBearerToken()
      const studentResponse = await axios.get<Student[]>(
        `admin/student/byTeacher`,
        {
          params: {
            teacherId: lessonForm.values.teacher,
            subjectId: lessonForm.values.subject,
          },
        }
      )
      setStudents(studentResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  const fetchFilteredTeachers = async () => {
    try {
      await setBearerToken()
      const teacherResponse = await axios.get<Teacher[]>(
        `admin/teacher/byStudent`,
        {
          params: {
            studentId: lessonForm.values.student,
            subjectId: lessonForm.values.subject,
          },
        }
      )
      setTeachers(teacherResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  const fetchFilteredSubjects = async () => {
    try {
      await setBearerToken()
      if (teacherIsEmpty()) {
        const subjectResponse = await axios.get<Subject[]>(
          `admin/subject/byStudent`,
          {
            params: {
              studentId: lessonForm.values.student,
            },
          }
        )
        setSubjects(subjectResponse.data)
      } else {
        const subjectResponse = await axios.get<Subject[]>(
          `admin/subject/byTeacher`,
          {
            params: {
              teacherId: lessonForm.values.teacher,
            },
          }
        )
        setSubjects(subjectResponse.data)
      }
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

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

  // const notificationObject = {
  //   title: `${
  //     error ? `Nie udało się dodać lekcji!` : "Udało się dodać lekcje!"
  //   }`,
  //   autoClose: 3000,
  //   icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
  //   color: error?.length > 0 ? "red" : "green",
  //   message: error ? `Nie udało się dodać lekcji` : `Udało się dodać lekcje`,
  // }

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
    // (notification)
  }

  const teacherIsEmpty = () => {
    return (
      lessonForm.values.teacher === null ||
      lessonForm.values.teacher.length === 0
    )
  }
  const studentIsEmpty = () => {
    return (
      lessonForm.values.student === null ||
      lessonForm.values.student.length === 0
    )
  }
  const subjectIsEmpty = () => {
    return (
      lessonForm.values.subject === null ||
      lessonForm.values.subject.length === 0
    )
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={lessonForm.onSubmit(handleSubmit)}>
        <Select
          required
          disabled={!teacherIsEmpty() && subjectIsEmpty()}
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
          onDropdownOpen={async () => {
            subjectIsEmpty()
              ? await fetchStudents()
              : await fetchFilteredStudents()
          }}
          {...lessonForm.getInputProps("student")}
        />

        <Select
          required
          disabled={!studentIsEmpty() && subjectIsEmpty()}
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
          onDropdownOpen={async () => {
            subjectIsEmpty()
              ? await fetchTeachers()
              : await fetchFilteredTeachers()
          }}
          {...lessonForm.getInputProps("teacher")}
        />

        <Select
          required
          disabled={studentIsEmpty() && teacherIsEmpty()}
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
          onDropdownOpen={fetchFilteredSubjects}
          {...lessonForm.getInputProps("subject")}
        />

        <Group position="right" mt="md">
          <Button color="red" disabled>
            Stwórz ITN
          </Button>
          <Button color="dark" type="submit">
            Dodaj lekcje
          </Button>
        </Group>
      </form>
    </Box>
  )
}
