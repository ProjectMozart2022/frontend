import {
  Box,
  Button,
  Group,
  MultiSelect,
  NumberInput,
  TextInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import axios, { AxiosError } from "axios"
import { FunctionComponent, useEffect, useState } from "react"
import { signOut } from "../../services/auth/signOut"
import { Subject } from "../../types/Subject"
import { Teacher } from "../../types/Teacher"

type TeacherFormType = {
  firstName: string
  lastName: string
  email: string
  password: string
  minimalNumOfHours: number
  taughtInstruments: string[]
  knownSubjects: string[]
}
interface IProps {
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
}

export const TeacherForm: FunctionComponent<IProps> = ({
  setTeachers,
  isAdding,
  setIsAdding,
}) => {
  const [_error, setError] = useState("")
  const [instruments, setInstruments] = useState<string[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  const teacherForm = useForm<TeacherFormType>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      minimalNumOfHours: 0,
      taughtInstruments: [],
      knownSubjects: [],
    },

    validate: (values) => ({
      firstName: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.firstName)
        ? null
        : "Niepoprawne imię",
      lastName: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.lastName)
        ? null
        : "Niepoprawne nazwisko",
      password:
        values.password.length >= 6
          ? null
          : "Hasło musi się składać z przynajmniej 6 znaków",
    }),
  })

  // const notificationObject = {
  //   title: `${
  //     error
  //       ? `Nie udało się dodać nauczyciela!`
  //       : "Udało się dodać nauczyciela!"
  //   }`,
  //   autoClose: 3000,
  //   icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
  //   color: error?.length > 0 ? "red" : "green",
  //   message: error
  //     ? `Nie udało się dodać nauczyciela ${teacherForm.values.firstName} ${teacherForm.values.lastName}!`
  //     : `Udało się dodać nauczyciela ${teacherForm.values.firstName} ${teacherForm.values.lastName}!`,
  // }

  const handleSubmit = async (teacherData: TeacherFormType) => {
    try {
      const subjectsId = [
        teacherData.knownSubjects
          .map((name) => subjects.find((subject) => subject.name === name)?.id)
          .reduce((acc, value) => {
            return { ...acc, ["id"]: value }
          }, {}),
      ]
      setIsAdding(!isAdding)
      await axios.post(`admin/teacher`, {
        ...teacherData,
        knownSubjects: subjectsId,
      })
      await fetchTeachers()
    } catch (error) {
      setIsAdding(!isAdding)
      const aError = error as AxiosError
      setError(aError.message)
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    setIsAdding(!isAdding)
    // TODO: error handling (notification)
  }

  const fetchTeachers = async () => {
    try {
      const teacherResponse = await axios.get<Teacher[]>(`admin/teacher`)
      setTeachers(teacherResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  const fetchInstruments = async () => {
    try {
      const instrumentsResponse = await axios.get<string[]>(`admin/instrument`)
      setInstruments(instrumentsResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  const fetchSubjects = async () => {
    try {
      const subjectResponse = await axios.get<Subject[]>(`admin/subject`)
      setSubjects(subjectResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  useEffect(() => {
    void fetchInstruments()
    void fetchSubjects()
  }, [])

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={teacherForm.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Email"
          placeholder="Email"
          {...teacherForm.getInputProps("email")}
        />

        <TextInput
          required
          type="password"
          label="Hasło"
          placeholder="Hasło"
          {...teacherForm.getInputProps("password")}
        />

        <TextInput
          required
          label="Imię nauczyciela"
          placeholder="Imię"
          {...teacherForm.getInputProps("firstName")}
        />

        <TextInput
          required
          label="Nazwisko nauczyciela"
          placeholder="Nazwisko"
          {...teacherForm.getInputProps("lastName")}
        />

        <NumberInput
          label="Liczba godzin"
          placeholder="Liczba godzin"
          {...teacherForm.getInputProps("minimalNumOfHours")}
        />

        <MultiSelect
          data={instruments}
          label="Nauczane instrumenty"
          placeholder="Instrumenty"
          searchable
          {...teacherForm.getInputProps("taughtInstruments")}
        />

        <MultiSelect
          data={subjects.map((subject) => subject.name)}
          label="Nauczane przedmioty"
          placeholder="Przedmioty"
          searchable
          {...teacherForm.getInputProps("knownSubjects")}
        />

        <Group position="right" mt="md">
          <Button type="submit" color="dark">
            Dodaj nauczyciela
          </Button>
        </Group>
      </form>
    </Box>
  )
}
