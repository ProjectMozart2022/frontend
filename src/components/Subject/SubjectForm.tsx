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
import axios from "axios"
import { useNotifications } from "@mantine/notifications"
import { Check, X } from "tabler-icons-react"
import { Subject } from "../../types/Subject"
import { showNotification } from "../../service/notificationService"

type SubjectFormIProps = {
  name: string
  lessonLength: number
  classRange: string[]
}

interface IProps {
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
}

export const SubjectForm: FunctionComponent<IProps> = ({
  isAdding,
  setIsAdding,
}) => {
  const notifications = useNotifications()
  const [error, setError] = useState("")

  const [classNumber] = useState(["1", "2", "3", "4", "5", "6", "7", "8"])

  const profileForm = useForm<SubjectFormIProps>({
    initialValues: {
      name: "",
      lessonLength: 45,
      classRange: [],
    },

    validate: (values) => ({}),
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

  const handleSubmit = async (profileData: SubjectFormIProps) => {
    setIsAdding(!isAdding)
    const payload: Subject = {
      ...profileData,
      classRange: profileData.classRange.map((classNum) => {
        return parseInt(classNum)
      }),
    }
    await axios.post(`admin/subject`, payload)
    // TODO: error handling
    showNotification(notifications, notificationObject)
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
