import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
} from "@mantine/core"
import { Selector, ChevronDown, ChevronUp, Search } from "tabler-icons-react"
import { tableStyle } from "./styles/tableStyle"
import { DeleteModal } from "../modals/DeleteModal"
import { EditTeacherModal } from "../modals/EditTeacherModal"
import { LessonsModal } from "../modals/LessonsModal"
import { Teacher } from "../../types/Teacher"

interface TeacherRowData {
  firebaseId: string
  firstName: string
  lastName: string
}

interface TeacherTableProps {
  teachers: Teacher[]
  setTeachers: Dispatch<SetStateAction<Teacher[]>>
}

interface TeacherThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}

const Th = ({ children, reversed, sorted, onSort }: TeacherThProps) => {
  const { classes } = tableStyle()
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  )
}

const filterData = (data: TeacherRowData[], search: string) => {
  const keys = Object.keys(data[0])
  const query = search.toLowerCase().trim()
  return data.filter((item) =>
    keys.some(() =>
      Object.values(item).toString().toLowerCase().includes(query)
    )
  )
}

const sortData = (
  data: TeacherRowData[],
  payload: { sortBy: keyof TeacherRowData; reversed: boolean; search: string }
) => {
  if (!payload.sortBy) {
    return filterData(data, payload.search)
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[payload.sortBy].localeCompare(a[payload.sortBy])
      }
      return a[payload.sortBy].localeCompare(b[payload.sortBy])
    }),
    payload.search
  )
}

export const TeacherTable = ({ teachers, setTeachers }: TeacherTableProps) => {
  const [search, setSearch] = useState("")
  const [sortedData, setSortedData] = useState<TeacherRowData[]>([])
  const [sortBy, setSortBy] = useState<keyof TeacherRowData>("lastName")
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  useEffect(() => {
    setSortedData(
      sortData(teachers, { sortBy, reversed: reverseSortDirection, search })
    )
  }, [teachers, sortBy, search, reverseSortDirection])

  const setSorting = (field: keyof TeacherRowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false
    setReverseSortDirection(reversed)
    setSortBy(field)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearch(value)
    setSortedData(
      sortData(sortedData, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    )
  }

  const rows = sortedData.map((row) => (
    <tr key={`${row.firebaseId}`}>
      <td>{row.lastName}</td>
      <td>{row.firstName}</td>
      <td>
        <EditTeacherModal
          id={row.firebaseId}
          setTeachers={setTeachers}
          teacher={{ firstName: row.firstName, lastName: row.lastName }}
        />
      </td>
      <td>
        <DeleteModal
          id={row.firebaseId}
          url="admin/teacher"
          dialog={`nauczyciela ${row.firstName} ${row.lastName}`}
        />
      </td>
      <td>
        <LessonsModal
          isStudent={false}
          lessons={
            teachers.filter(
              (teacher) => teacher.firebaseId === row.firebaseId
            )[0].lessons
          }
        />
      </td>
    </tr>
  ))

  return (
    <ScrollArea style={{ marginBottom: 10 }}>
      <TextInput
        placeholder=""
        mb="md"
        icon={<Search size={14} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        highlightOnHover
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ minWidth: 700 }}>
        <thead>
          <tr>
            <Th
              sorted={sortBy === "lastName"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("lastName")}>
              Nazwisko
            </Th>
            <Th
              sorted={sortBy === "firstName"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("firstName")}>
              Imię
            </Th>
            <th>Edycja</th>
            <th>Usuwanie</th>
            <th>Pokaż lekcje nauczyciela</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={4}>
                <Text weight={500} align="center">
                  Brak wyników
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  )
}
