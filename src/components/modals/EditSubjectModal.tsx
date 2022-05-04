import { useState, FunctionComponent } from "react"
import {
  Modal,
  Group,
  ActionIcon,
  Button,
  Text,
  Box,
  TextInput,
  NumberInput,
  MultiSelect,
} from "@mantine/core"
import { Edit } from "tabler-icons-react"
import axios, { AxiosError } from "axios"
import { signOut } from "../../services/signOut"
import { useForm } from "@mantine/form"
import { SubjectFormType } from "../Subject/SubjectForm"

interface IPropsEditSubjectModal {
  id: number
  subject: SubjectFormType
}

export const EditSubjectModal: FunctionComponent<IPropsEditSubjectModal> = ({
  id,
  subject,
}) => {
  const [opened, setOpened] = useState(false)
  /* TODO: classNumber jako enum */
  const [classNumber] = useState(["1", "2", "3", "4", "5", "6", "7", "8"])
  const subjectEditForm = useForm<SubjectFormType>({
    initialValues: {
      name: subject.name,
      lessonLength: subject.lessonLength,
      classRange: subject.classRange,
    },
    /* TODO: WALIDACJA */
    validate: () => ({}),
  })

  const editSubject = async (subjectNewData: SubjectFormType) => {
    /* TODO: implementacja logiki patcha, tak gdy informowac uzytkownika jezeli nie zmienil zadnego pola, wysylac tylko zmienione pola */
    try {
      await axios.put(`admin/subject`, {
        /* TODO: NIE POZWALAJ NA WYSYLANIE PUSTEGO CLASSRANGE */
        id: id,
        ...subjectNewData,
        classRange: subjectNewData.classRange.map((classnumber) => {
          return parseInt(classnumber)
        }),
      })
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
          <form onSubmit={subjectEditForm.onSubmit(editSubject)}>
            <TextInput
              required
              type="text"
              placeholder="nazwa"
              label="Nazwa zajęć"
              {...subjectEditForm.getInputProps("name")}
            />

            <NumberInput
              required
              type="number"
              placeholder="długość zajęć"
              label="Długość zajęć"
              {...subjectEditForm.getInputProps("lessonLength")}
            />

            <MultiSelect
              required
              type="number"
              label="Przeznaczony dla klas"
              placeholder="klasa"
              data={classNumber}
              searchable
              {...subjectEditForm.getInputProps("classRange")}
            />
            <Text>Jesteś pewien, że chcesz zmienić dane przedmiotu?</Text>
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
