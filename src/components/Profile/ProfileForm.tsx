import React, { useState } from "react"
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
import { Profile } from "../../types/Profile"
import { showNotification } from "../../service/notificationService"

type ProfileFormIProps = {
  name: string
  lessonLength: number
  classRange: string[]
}

export const ProfileForm: React.FC = () => {
  const URL = "http://localhost:4567/api/profile"
  const notifications = useNotifications()
  const [error, setError] = useState("")

  /* narazie na sztywno */
  const [classNumber] = useState(["1", "2", "3", "4", "5", "6", "7", "8"])

  const profileForm = useForm<ProfileFormIProps>({
    initialValues: {
      name: "",
      lessonLength: 45,
      classRange: [],
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
      ? `Nie udało się dodać profilu ${profileForm.values.name}`
      : `Udało się dodać profil ${profileForm.values.name}`,
  }

  const handleSubmit = (profileData: ProfileFormIProps) => {
    const payload: Profile = {
      ...profileData,
      classRange: profileData.classRange.map((classNum) => {
        return parseInt(classNum)
      }),
    }
    axios
      .post(URL, payload, {
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
            Dodaj Profil
          </Button>
        </Group>
      </form>
    </Box>
  )
}
