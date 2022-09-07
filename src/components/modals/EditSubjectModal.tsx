import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Text,
  TextInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import axios, { AxiosError } from "axios"
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react"
import { Edit } from "tabler-icons-react"
import { signOut } from "../../services/auth"
import { Subject } from "../../types/Subject"
import { SubjectFormType } from "../Subject/SubjectForm"

interface IPropsEditSubjectModal {
  id: number
  setSubjects: Dispatch<SetStateAction<Subject[]>>
  subject: SubjectFormType
}

export const EditSubjectModal: FunctionComponent<IPropsEditSubjectModal> = ({
  id,
  setSubjects,
  subject,
}) => {
  const [opened, setOpened] = useState(false)
  /* TODO: classNumber jako enum */
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
  const subjectEditForm = useForm<SubjectFormType>({
    initialValues: {
      name: subject.name,
      lessonLength: subject.lessonLength,
      classRange: subject.classRange,
    },
    /* TODO: WALIDACJA */
    validate: () => ({
      classRange: (value: string) =>
        value === null ? "Należy wybrać chociaż jedną klasę!" : null,
    }),
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
      await fetchSubjects()
    } catch (error) {
      console.log(error)
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    setOpened(false)
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
              min={5}
              step={5}
              max={300}
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
          onClick={() => setOpened(true)}>
          <Edit size={16} />
        </ActionIcon>
      </Group>
    </>
  )
}
