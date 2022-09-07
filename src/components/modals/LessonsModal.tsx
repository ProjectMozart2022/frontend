import { ActionIcon, Group, Modal } from "@mantine/core"
import { FunctionComponent, useState } from "react"
import { ListNumbers } from "tabler-icons-react"
import { Lesson } from "../../types/Lesson"
import { LessonTable } from "../Tables/LessonTable"
interface LessonModalIProps {
  lessons: Lesson[]
  isStudent: boolean
}

export const LessonsModal: FunctionComponent<LessonModalIProps> = ({
  lessons,
  isStudent,
}) => {
  const [opened, setOpened] = useState(false)
  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        overlayColor="gray"
        overlayOpacity={0.95}
        size={"xl"}
        closeButtonLabel="Close delete modal">
        <LessonTable
          data={lessons.map((lesson) => {
            const lessonData = {
              person: isStudent
                ? lesson.teacher.firstName + " " + lesson.teacher.lastName
                : lesson.student.firstName + " " + lesson.student.lastName,
              lessonLength: lesson.subject.lessonLength.toString(),
              subjectName: lesson.subject.name,
            }
            return lessonData
          })}
        />
      </Modal>
      <Group position="center">
        <ActionIcon
          aria-label="delete"
          variant="outline"
          color="blue"
          onClick={() => setOpened(true)}>
          <ListNumbers size={16} />
        </ActionIcon>
      </Group>
    </>
  )
}
