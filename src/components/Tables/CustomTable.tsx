import { ScrollArea, Table } from "@mantine/core"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Student } from "../../types/Student"
import { tableStyle } from "./styles/tableStyle"

const data: Student[] = [
  {
    id: 1,
    firstName: "tanner",
    lastName: "linsley",
    classNumber: 12,
    mainInstrument: "SAX",
    hasAllMandatorySubjectsAssigned: true,
    hasITN: false,
  },
  {
    id: 2,
    firstName: "Antoni",
    lastName: "warwoski",
    classNumber: 3,
    mainInstrument: "DRUMS",
    hasAllMandatorySubjectsAssigned: false,
    hasITN: false,
  },
  {
    id: 3,
    firstName: "tanner",
    lastName: "linsley",
    classNumber: 5,
    mainInstrument: "PIANO",
    hasAllMandatorySubjectsAssigned: false,
    hasITN: false,
  },
]

export const CustomTable = () => {
  const { classes } = tableStyle()
  const columnHelper = createColumnHelper<Student>()
  const columns = [
    columnHelper.accessor((row) => row.firstName, {
      id: "firstName",
      header: () => <span>Imię</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: "lastName",
      header: () => <span>Nazwisko</span>,
      cell: (info) => <i>{info.getValue()}</i>,
    }),
    columnHelper.accessor((row) => row.classNumber, {
      id: "classNumber",
      header: () => <span>Klasa</span>,
      cell: (info) => <i>{info.getValue()}</i>,
    }),
  ]
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  return (
    <ScrollArea style={{ marginBottom: 10 }}>
      <Table
        highlightOnHover
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ minWidth: 700 }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className={classes.th} key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </Table>
    </ScrollArea>
  )
}
