import { useState, FunctionComponent } from 'react';
import { Modal, Group, ActionIcon, Button } from '@mantine/core';
import { X } from "tabler-icons-react"
import axios from "axios"

interface IPropsDeleteModal {
  id: number
  firstName: string
  lastName: string
}

export const DeleteModal: FunctionComponent<IPropsDeleteModal> = ({
  id,
  firstName,
  lastName,
}) => {
  const [opened, setOpened] = useState(false)

  const deleteStudent = async (id: number) => {
    try {
      await axios.delete(`admin/student?id=${id}`)
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
        overlayColor={"gray"}
        overlayOpacity={0.95}
        closeButtonLabel="Close delete student modal">
        <h4>
          Jesteś pewien, że chcesz usunąć ucznia {firstName} {lastName}
        </h4>
        <Group position="center" grow>
          <Button onClick={() => deleteStudent(id)}>Tak, usuń</Button>
          <Button onClick={() => setOpened(false)}>Nie usuwaj</Button>
        </Group>
      </Modal>

      <Group position="center">
        <ActionIcon
          aria-label="delete"
          variant="outline"
          color="red"
          onClick={() => setOpened(true)}>
          <X size={16}></X>
        </ActionIcon>
      </Group>
    </>
  )
}