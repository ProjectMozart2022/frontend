import {
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Student } from "../../types/Student"
import { DeleteModal } from "../modals/DeleteModal"
import { EditStudentModal } from "../modals/EditStudentModal"
import { LessonsModal } from "../modals/LessonsModal"
import { tableStyle } from "./styles/tableStyle"

interface StudentRowData {
  id: string
  firstName: string
  lastName: string
  classNumber: string
  mainInstrument: string
}

interface StudentTableProps {
  students: Student[]
  setStudents: Dispatch<SetStateAction<Student[]>>
}

interface StudentThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}

const Th = ({ children, reversed, sorted, onSort }: StudentThProps) => {
  const { classes } = tableStyle()
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
        </Group>
      </UnstyledButton>
    </th>
  )
}

const filterData = (data: StudentRowData[], search: string) => {
  const keys = Object.keys(data[0])
  const query = search.toLowerCase().trim()
  return data.filter((item) =>
    keys.some(() =>
      Object.values(item).toString().toLowerCase().includes(query)
    )
  )
}

const sortData = (
  data: StudentRowData[],
  payload: { sortBy: keyof StudentRowData; reversed: boolean; search: string }
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

export const StudentTable = ({ students, setStudents }: StudentTableProps) => {
  const [search, setSearch] = useState("")
  const [sortedData, setSortedData] = useState<StudentRowData[]>([])
  const [sortBy, setSortBy] = useState<keyof StudentRowData>("firstName")
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  useEffect(() => {
    setSortedData(
      sortData(
        students.map((student) => {
          const studentData = {
            ...student,
            id: student.id.toString(),
            classNumber: student.classNumber.toString(),
            lessons: "",
          }
          return studentData
        }),
        { sortBy, reversed: reverseSortDirection, search }
      )
    )
  }, [students, sortBy, search, reverseSortDirection])

  const setSorting = (field: keyof StudentRowData) => {
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
    <tr
      key={`${row.id}`}
      /* TODO: wyodrebnic logike */
      style={{
        backgroundColor: students.find(
          (student) => student.id === parseInt(row.id)
        )?.hasAllMandatorySubjectsAssigned
          ? "white"
          : "#FF6666",
      }}>
      <td>
        {students.find((student) => student.id === parseInt(row.id))?.hasITN ? (
          <Tooltip
            label={"On jest specjalny..."}
            transition={"pop"}
            transitionDuration={400}
            transitionTimingFunction="ease"
            openDelay={300}
            closeDelay={500}></Tooltip>
        ) : null}
        {row.firstName}
      </td>
      <td>{row.lastName}</td>
      <td>{row.classNumber}</td>
      <td>{row.mainInstrument}</td>
      <td>
        <EditStudentModal
          id={parseInt(row.id)}
          setStudents={setStudents}
          student={{ ...row, classNumber: parseInt(row.classNumber) }}
        />
      </td>
      <td>
        <DeleteModal
          id={parseInt(row.id)}
          url="admin/student"
          dialog={`ucznia ${row.firstName} ${row.lastName}`}
        />
      </td>
      <td>
        <LessonsModal
          isStudent={true}
          lessons={
            students.filter((student) => student.id === parseInt(row.id))[0]
              .lessons
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
              sorted={sortBy === "firstName"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("firstName")}>
              Imię
            </Th>
            <Th
              sorted={sortBy === "lastName"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("lastName")}>
              Nazwisko
            </Th>
            <Th
              sorted={sortBy === "classNumber"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("classNumber")}>
              Klasa
            </Th>
            <Th
              sorted={sortBy === "mainInstrument"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("mainInstrument")}>
              Instrument główny
            </Th>
            <th>Edycja</th>
            <th>Usuwanie</th>
            <th>Sprawdź lekcję ucznia</th>
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
