import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Text,
  TextInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import axios, { AxiosError } from "axios"
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react"
import { signOut } from "../../services/auth"
import { Teacher } from "../../types/Teacher"

interface IPropsEditTeacherModal {
  id: string
  setTeachers: Dispatch<SetStateAction<Teacher[]>>
  teacher: TeacherFormType
}

type TeacherFormType = {
  firstName: string
  lastName: string
}

export const EditTeacherModal: FunctionComponent<IPropsEditTeacherModal> = ({
  id,
  setTeachers,
  teacher,
}) => {
  const [opened, setOpened] = useState(false)
  const teacherEditForm = useForm<TeacherFormType>({
    initialValues: {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
    },
    validate: (values) => ({
      firstName: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.firstName)
        ? null
        : "Niepoprawne imię",
      lastName: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.lastName)
        ? null
        : "Niepoprawne nazwisko",
    }),
  })

  const editTeacher = async (teacherNewData: TeacherFormType) => {
    /* TODO: implementacja logiki patcha, tak gdy informowac uzytkownika jezeli nie zmienil zadnego pola, wysylac tylko zmienione pola */
    try {
      await axios.put(`admin/teacher`, { firebaseId: id, ...teacherNewData })
      await fetchTeachers()
    } catch (error) {
      console.log(error)
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    setOpened(false)
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

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        overlayColor="gray"
        overlayOpacity={0.95}
        closeButtonLabel="Close edit modal">
        <Box sx={{ maxWidth: 400 }} mx="auto">
          <form onSubmit={teacherEditForm.onSubmit(editTeacher)}>
            <TextInput
              required
              label="Imię nauczyciela"
              placeholder="Imię"
              type="text"
              {...teacherEditForm.getInputProps("firstName")}
            />

            <TextInput
              required
              label="Nazwisko nauczyciela"
              placeholder="Nazwisko"
              type="text"
              {...teacherEditForm.getInputProps("lastName")}
            />
            <Text>Jesteś pewien, że chcesz zmienić dane nauczyciela?</Text>
            <Group position="center" grow>
              <Button color="yellow" type="submit">
                Tak, zmień
              </Button>
              <Button onClick={() => setOpened(false)}>Nie zmieniaj</Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <Group position="center">
        <ActionIcon
          aria-label="edit"
          variant="outline"
          color="yellow"
          onClick={() => setOpened(true)}></ActionIcon>
      </Group>
    </>
  )
}
