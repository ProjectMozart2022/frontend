import { useState, FunctionComponent, Dispatch, SetStateAction } from "react"
import {
  Modal,
  Group,
  ActionIcon,
  Button,
  Text,
  Box,
  TextInput,
  NumberInput
} from "@mantine/core"
import { Edit } from "tabler-icons-react"
import axios, { AxiosError } from "axios"
import { signOut } from "../../services/signOut"
import { useForm } from "@mantine/form"
import { StudentFormType } from "../Student/StudentForm"
import { Student } from "../../types/Student"

interface IPropsEditStudentModal {
  id: number
  setStudents: Dispatch<SetStateAction<Student[]>>
  student: StudentFormType
}

export const EditStudentModal: FunctionComponent<IPropsEditStudentModal> = ({
  id,
  setStudents,
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
      await fetchStudents()
    } catch (error) {
      console.log(error)
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    setOpened(false)
  }

  const fetchStudents = async () => {
    try {
      const studentResponse = await axios.get<Student[]>(`admin/student`)
      setStudents(studentResponse.data)
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
            <NumberInput
              required
              type="number"
              min={1}
              max={12}
              step={1}
              label="Klasa ucznia"
              placeholder="Podaj numer klasy ucznia"
              {...studentEditForm.getInputProps("classNumber")}
            />
            <Text>Jesteś pewien, że chcesz zmienić dane studenta?</Text>
            <Group position="center" grow>
              <Button color="yellow" type="submit">Tak, zmień</Button>
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
