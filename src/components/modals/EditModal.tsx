import { useState, FunctionComponent } from 'react';
import { Modal, Group, ActionIcon, Button } from '@mantine/core';
import { Edit } from "tabler-icons-react"

interface IPropsEditModal {
 id: number
 firstName: string
 lastName: string
}

export const EditModal: FunctionComponent<IPropsEditModal> = (
 {id, firstName, lastName}
) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        overlayColor={"gray"}
        overlayOpacity={0.95}
        closeButtonLabel="Close edit modal"
      >
      <h4>Jesteś pewien, że chcesz zmienić dane ucznia {firstName} {lastName}</h4>
       <Group position="center" grow>
        <Button>Tak, zmień
        </Button>
        <Button>Nie zmieniaj</Button>
       </Group>
      </Modal>

      <Group position="center">
        <ActionIcon aria-label="edit" variant="outline" color="red" onClick={() => setOpened(true)}><Edit size={16}></Edit></ActionIcon>
      </Group>
    </>
  );
}
