import {
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core"
import React, { useState } from "react"
import { ChevronDown, ChevronUp, Search, Selector } from "tabler-icons-react"
import { tableStyle } from "./styles/tableStyle"

export interface LessonRowData {
  person: string
  lessonLength: string
  subjectName: string
}

export interface SubjectTableProps {
  data: LessonRowData[]
}

interface LessonThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}

const Th = ({ children, reversed, sorted, onSort }: LessonThProps) => {
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

const filterData = (data: LessonRowData[], search: string) => {
  const keys = Object.keys(data[0])
  const query = search.toLowerCase().trim()
  return data.filter((item) =>
    keys.some(() =>
      Object.values(item).toString().toLowerCase().includes(query)
    )
  )
}

const sortData = (
  data: LessonRowData[],
  payload: { sortBy: keyof LessonRowData; reversed: boolean; search: string }
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

export const LessonTable = ({ data }: SubjectTableProps) => {
  const [search, setSearch] = useState("")
  const [sortedData, setSortedData] = useState(data)
  const [sortBy, setSortBy] = useState<keyof LessonRowData>("person")
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  const setSorting = (field: keyof LessonRowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false
    setReverseSortDirection(reversed)
    setSortBy(field)
    setSortedData(sortData(data, { sortBy: field, reversed, search }))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearch(value)
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    )
  }

  const rows = sortedData.map((row) => (
    <tr key={`${row.person}-${row.subjectName}`}>
      <td>{row.person}</td>
      <td>{row.lessonLength}</td>
      <td>{row.subjectName}</td>
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
              sorted={sortBy === "person"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("person")}>
              Osoba
            </Th>
            <Th
              sorted={sortBy === "lessonLength"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("lessonLength")}>
              Długość zajęć
            </Th>
            <Th
              sorted={sortBy === "subjectName"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("subjectName")}>
              Nazwa zajęć
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={3}>
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
