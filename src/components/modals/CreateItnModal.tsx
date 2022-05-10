import { useState, FunctionComponent, Dispatch, SetStateAction } from "react"
import {
  Modal,
  Group,
  ActionIcon,
  Button,
  Text,
  Box,
  TextInput,
  NumberInput,
} from "@mantine/core"
import { Edit } from "tabler-icons-react"
import { useForm } from "@mantine/form"
import { ITN } from "../../types/ITN"

interface IPropsCreateITNModal {
 setItn: Dispatch<SetStateAction<ITN | undefined>>
}

type SubjectITNFormType = {
 name: string,
 lessonLength: number
}

export const CreateItnModal: FunctionComponent<IPropsCreateITNModal> = ({
  setItn
}) => {
  const [opened, setOpened] = useState(false)
  const subjectEditForm = useForm<SubjectITNFormType>({
    initialValues: {
      name: "",
      lessonLength: 45,
    },
    /* TODO: WALIDACJA */
    // validate: () => (),
  })

  const createITNSubject = (subjectNewData: SubjectITNFormType) => {
    setItn({
      ...subjectNewData,
      classRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    })
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
          <form onSubmit={subjectEditForm.onSubmit(createITNSubject)}>
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

            <Text>Jesteś pewien, że chcesz stworzyć ITN?</Text>
            <Group position="center" grow>
              <Button color="yellow" type="submit">
                Tak, stwórz
              </Button>
              <Button onClick={() => setOpened(false)}>Nie twórz</Button>
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
