import { ActionIcon, Button, Group, Modal, Text } from "@mantine/core"
import axios from "axios"
import { FunctionComponent, useState } from "react"

interface IPropsDeleteModal {
  id: number | string
  url: string
  dialog: string
}

export const DeleteModal: FunctionComponent<IPropsDeleteModal> = ({
  id,
  url,
  dialog,
}) => {
  const [opened, setOpened] = useState(false)

  const deleteEntity = async (id: number | string) => {
    try {
      await axios.delete(`${url}?id=${id}`)
    } catch (error) {
      console.log(error)
    }
    setOpened(false)
  }

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        overlayColor="gray"
        overlayOpacity={0.95}
        closeButtonLabel="Close delete modal">
        <Text>Jesteś pewien, że chcesz usunąć {dialog}</Text>
        <Group position="center" grow>
          <Button color="red" onClick={() => deleteEntity(id)}>
            Tak, usuń
          </Button>
          <Button onClick={() => setOpened(false)}>Nie usuwaj</Button>
        </Group>
      </Modal>

      <Group position="center">
        <ActionIcon
          aria-label="delete"
          variant="outline"
          color="red"
          onClick={() => setOpened(true)}></ActionIcon>
      </Group>
    </>
  )
}
