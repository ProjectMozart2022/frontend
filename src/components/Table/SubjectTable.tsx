import React, { useState } from "react"
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

interface SubjectRowData {
  name: string
  lessonLength: string
  classRange: string
}

export interface SubjectTableProps {
  data: SubjectRowData[]
}

interface SubjectThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}

const Th = ({ children, reversed, sorted, onSort }: SubjectThProps) => {
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

const filterData = (data: SubjectRowData[], search: string) => {
  const keys = Object.keys(data[0])
  const query = search.toLowerCase().trim()
  return data.filter((item) =>
    keys.some((key) =>
      Object.values(item).toString().toLowerCase().includes(query)
    )
  )
}

const sortData = (
  data: SubjectRowData[],
  payload: { sortBy: keyof SubjectRowData; reversed: boolean; search: string }
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

export const SubjectTable = ({ data }: SubjectTableProps) => {
  const [search, setSearch] = useState("")
  const [sortedData, setSortedData] = useState(data)
  const [sortBy, setSortBy] = useState<keyof SubjectRowData>("name")
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  const setSorting = (field: keyof SubjectRowData) => {
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
    <tr key={`${row.name}-${row.lessonLength}-${row.classRange}`}>
      <td>{row.name}</td>
      <td>{row.lessonLength}</td>
      <td>{row.classRange}</td>
    </tr>
  ))

  return (
    <ScrollArea>
      <TextInput
        placeholder=""
        mb="md"
        icon={<Search size={14} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed", minWidth: 700 }}>
        <thead>
          <tr>
            <Th
              sorted={sortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("name")}>
              Nazwa
            </Th>
            <Th
              sorted={sortBy === "lessonLength"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("lessonLength")}>
              Czas trwania zajęć
            </Th>
            <Th
              sorted={sortBy === "classRange"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("classRange")}>
              Przeznaczony dla klas
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
