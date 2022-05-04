import React, { useState, FunctionComponent } from "react"
import {
  TextInput,
  Button,
  Group,
  Box,
  NumberInput,
  MultiSelect,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import axios, { AxiosError } from "axios"
import { useNotifications } from "@mantine/notifications"
import { Check, X } from "tabler-icons-react"
import { showNotification } from "../../services/notificationService"
import { signOut } from "../../services/signOut"
import { Subject } from "../../types/Subject"

export type SubjectFormType = {
  name: string
  lessonLength: number
  classRange: string[]
}

type SubjectCreateType = {
  name: string
  lessonLength: number
  classRange: number[]
}
interface IProps {
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
}

export const SubjectForm: FunctionComponent<IProps> = ({
  setSubjects,
  isAdding,
  setIsAdding,
}) => {
  const notifications = useNotifications()
  const [error] = useState("")

  const [classNumber] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ])

  const profileForm = useForm<SubjectFormType>({
    initialValues: {
      name: "",
      lessonLength: 45,
      classRange: [],
    },

    validate: () => ({}),
  })

  const notificationObject = {
    title: `${
      error ? `Nie udało się dodać przedmiotu!` : "Udało się dodać przedmiot!"
    }`,
    autoClose: 3000,
    icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
    color: error?.length > 0 ? "red" : "green",
    message: error
      ? `Nie udało się dodać przedmiotu ${profileForm.values.name}`
      : `Udało się dodać przedmiot ${profileForm.values.name}`,
  }

  const handleSubmit = async (profileData: SubjectFormType) => {
    try {
      setIsAdding(!isAdding)
      const payload: SubjectCreateType = {
        ...profileData,
        classRange: profileData.classRange.map((classNum) => {
          return parseInt(classNum)
        }),
      }
      await axios.post(`admin/subject`, payload)
      await fetchSubjects()
    } catch (error) {
      setIsAdding(!isAdding)
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    setIsAdding(!isAdding)
    // TODO: error handling
    showNotification(notifications, notificationObject)
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

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={profileForm.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Nazwa zajęć"
          placeholder="nazwa"
          {...profileForm.getInputProps("name")}
        />

        <NumberInput
          required
          defaultValue={45}
          min={5}
          max={300}
          step={5}
          placeholder="długość zajęć"
          label="Długość zajęć"
          {...profileForm.getInputProps("lessonLength")}
        />

        <MultiSelect
          required
          label="Wybierz klase"
          placeholder="klasa"
          data={classNumber}
          searchable
          {...profileForm.getInputProps("classRange")}
        />

        <Group position="right" mt="md">
          <Button color="dark" type="submit">
            Dodaj Przedmiot
          </Button>
        </Group>
      </form>
    </Box>
  )
}
