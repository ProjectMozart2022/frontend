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
import { EditSubjectModal } from "../modals/EditSubjectModal"
import { DeleteModal } from "../modals/DeleteModal"
import { Subject } from "../../types/Subject"

interface SubjectRowData {
  id: string
  name: string
  lessonLength: string
  classRange: string
}

interface SubjectTableProps {
  subjects: Subject[]
  setSubjects: Dispatch<SetStateAction<Subject[]>>
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
    keys.some(() =>
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

export const SubjectTable = ({ subjects, setSubjects }: SubjectTableProps) => {
  const [search, setSearch] = useState("")
  const [sortedData, setSortedData] = useState<SubjectRowData[]>([])
  const [sortBy, setSortBy] = useState<keyof SubjectRowData>("name")
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  useEffect(() => {
    setSortedData(
      sortData(
        subjects.map((subject) => {
          const subjectData = {
            ...subject,
            id: subject.id.toString(),
            lessonLength: subject.lessonLength.toString(),
            classRange: subject.classRange.toString(),
          }
          return subjectData
        }),
        { sortBy, reversed: reverseSortDirection, search }
      )
    )
  }, [subjects, sortBy, search, reverseSortDirection])

  const setSorting = (field: keyof SubjectRowData) => {
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
    <tr key={`${row.id}`}>
      <td>{row.name}</td>
      <td>{row.lessonLength}</td>
      <td>
        {row.classRange
          .split(",")
          .sort((a, b) => parseInt(a) - parseInt(b))
          .join(", ")}
      </td>
      <td>
        <EditSubjectModal
          id={parseInt(row.id)}
          setSubjects={setSubjects}
          subject={{
            ...row,
            lessonLength: parseInt(row.lessonLength),
            classRange: row.classRange.split(","),
          }}
        />
      </td>
      <td>
        <DeleteModal
          id={parseInt(row.id)}
          url="admin/subject"
          dialog={`przedmiot ${row.name}`}
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
            <th>Edycja</th>
            <th>Usuwanie</th>
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
