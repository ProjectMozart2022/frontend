import {
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Search, Selector } from "tabler-icons-react"
import { Teacher } from "../../types/Teacher"
import { DeleteModal } from "../modals/DeleteModal"
import { EditTeacherModal } from "../modals/EditTeacherModal"
import { LessonsModal } from "../modals/LessonsModal"
import { tableStyle } from "./styles/tableStyle"

interface TeacherRowData {
  firebaseId: string
  firstName: string
  lastName: string
  minimumNumOfHours: string
  actualNumOfHours: string
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
    const convertedTeachers = teachers.map((teacher) => {
      return {
        ...teacher,
        minimumNumOfHours: teacher.minimalNumOfHours.toString(),
        actualNumOfHours: teacher.actualNumOfHours.toString(),
      }
    })
    setSortedData(
      sortData(convertedTeachers, {
        sortBy,
        reversed: reverseSortDirection,
        search,
      })
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

  const isCorrect = (teacher: TeacherRowData) => {
    return (
      parseFloat(teacher.minimumNumOfHours) <=
      parseFloat(teacher.actualNumOfHours)
    )
  }

  const rows = sortedData.map((row) => (
    <tr
      key={`${row.firebaseId}`}
      style={{ backgroundColor: isCorrect(row) ? "white" : "#FF6666" }}>
      <td>{row.lastName}</td>
      <td>{row.firstName}</td>
      <td>{row.actualNumOfHours}</td>
      <td>{row.minimumNumOfHours}</td>
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
            <Th
              sorted={sortBy === "actualNumOfHours"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("actualNumOfHours")}>
              Godziny pracy
            </Th>
            <Th
              sorted={sortBy === "minimumNumOfHours"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("minimumNumOfHours")}>
              Min. godziny pracy
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
              <td colSpan={6}>
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
