import { useState, FunctionComponent } from "react"
import {
  Modal,
  Group,
  ActionIcon,
  Button,
  Text,
  Box,
  TextInput,
} from "@mantine/core"
import { Edit } from "tabler-icons-react"
import axios, { AxiosError } from "axios"
import { signOut } from "../../services/signOut"
import { useForm } from "@mantine/form"
import { StudentFormType } from "../Student/StudentForm"

interface IPropsEditStudentModal {
  id: number
  student: StudentFormType
}

export const EditStudentModal: FunctionComponent<IPropsEditStudentModal> = ({
  id,
  student,
}) => {
  const [opened, setOpened] = useState(false)
  const studentEditForm = useForm<StudentFormType>({
    initialValues: {
      firstName: student.firstName,
      lastName: student.lastName,
      classNumber: student.classNumber,
    },
    validate: (values) => ({
      classNumber: /[1-8]{1}/.test(`${values.classNumber}`)
        ? null
        : "Nieprawidłowy identyfikator klasy",
      firstName: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.firstName)
        ? null
        : "Nieprawidłowe imię",
      lastName: /[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(values.lastName)
        ? null
        : "Nieprawidłowe nazwisko",
    }),
  })

  const editStudent = async (studentNewData: StudentFormType) => {
    /* TODO: implementacja logiki patcha, tak gdy informowac uzytkownika jezeli nie zmienil zadnego pola, wysylac tylko zmienione pola */
    try {
      await axios.put(`admin/student`, { id: id, ...studentNewData })
    } catch (error) {
      console.log(error)
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    setOpened(false)
  }

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        overlayColor={"gray"}
        overlayOpacity={0.95}
        closeButtonLabel="Close edit modal">
        <Box sx={{ maxWidth: 400 }} mx="auto">
          <form onSubmit={studentEditForm.onSubmit(editStudent)}>
            <TextInput
              required
              type="text"
              label="Imię ucznia"
              placeholder="Podaj imię ucznia"
              {...studentEditForm.getInputProps("firstName")}
            />
            <TextInput
              required
              type="text"
              label="Nazwisko ucznia"
              placeholder="Podaj nazwisko ucznia"
              {...studentEditForm.getInputProps("lastName")}
            />
            <TextInput
              required
              type="number"
              label="Klasa ucznia"
              placeholder="Podaj numer klasy ucznia"
              {...studentEditForm.getInputProps("classNumber")}
            />
            <Text>Jesteś pewien, że chcesz zmienić dane studenta?</Text>
            <Group position="center" grow>
              <Button type="submit">Tak, zmień</Button>
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
          onClick={() => setOpened(true)}>
          <Edit size={16} />
        </ActionIcon>
      </Group>
    </>
  )
}
