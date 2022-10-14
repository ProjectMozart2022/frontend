type TeacherReport = {
  firstName: string
  lastName: string
  minutesInTotal: number
}

export interface SummaryReport {
  teacherReports: TeacherReport[]
}
