import { useState, FunctionComponent } from 'react';
import { Modal, Group, ActionIcon, Button, Text } from '@mantine/core';
import { Edit } from "tabler-icons-react"

interface IPropsEditModal {
  id: number
  dialog: string
}

export const EditModal: FunctionComponent<IPropsEditModal> = ({
  id, dialog
}) => {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        overlayColor={"gray"}
        overlayOpacity={0.95}
        closeButtonLabel="Close edit modal">
        <Text>
          Jesteś pewien, że chcesz zmienić dane {dialog}{id}
        </Text>
        <Group position="center" grow>
          <Button>Tak, zmień</Button>
          <Button onClick={() => setOpened(false)}>Nie zmieniaj</Button>
        </Group>
      </Modal>

      <Group position="center">
        <ActionIcon
          aria-label="edit"
          variant="outline"
          color="red"
          onClick={() => setOpened(true)}>
          <Edit size={16}></Edit>
        </ActionIcon>
      </Group>
    </>
  )
}
