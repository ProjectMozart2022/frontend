import axios, { AxiosError } from "axios"
import { Container } from "@mantine/core"
import { useState, useEffect, FunctionComponent } from "react"
import { signOut } from "../../services/signOut"
import { setBearerToken } from "../../services/setBearerToken"
import { TeacherReport } from "../../types/TeacherReport"
import { ReportTable } from "../Tables/ReportTable"

interface SummaryReport {
  teacherReports: TeacherReport[]
}

const ReportContainer: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [report, setReport] = useState<SummaryReport>({ teacherReports: [] })
  const [, setError] = useState("")

  const fetchReport = async () => {
    setIsLoading(true)
    try {
      await setBearerToken()
      const reportResponse = await axios.get<SummaryReport>(`admin/report`)
      setReport(reportResponse.data)
      setIsLoading(false)
    } catch (error) {
      setError(error as string)
      setIsLoading(false)
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  useEffect(() => {
    void fetchReport()
  }, [])

  return (
    <Container className="studentContainer">
      {!isLoading ? (
        <ReportTable
          data={report.teacherReports.map((teacher) => {
            const teacherReportData = {
              firstName: teacher.firstName,
              lastName: teacher.lastName,
              minutesInTotal: teacher.minutesInTotal.toString(),
            }
            return teacherReportData
          })}
        />
      ) : null}
    </Container>
  )
}

export default ReportContainer
