import { ActionIcon, Group, Modal, Text } from "@mantine/core"
import React, { useState, FunctionComponent } from "react"
import { ListNumbers } from "tabler-icons-react"
interface IProps {
  lessons: string
}

export const LessonsModal: FunctionComponent<IProps> = ({ lessons }) => {
  const [opened, setOpened] = useState(false)
  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        overlayColor="gray"
        overlayOpacity={0.95}
        closeButtonLabel="Close delete modal">
        <Text>{lessons}</Text>
      </Modal>
      <Group position="center">
        <ActionIcon
          aria-label="delete"
          variant="outline"
          color="red"
          onClick={() => setOpened(true)}>
          <ListNumbers size={16} />
        </ActionIcon>
      </Group>
    </>
  )
}
