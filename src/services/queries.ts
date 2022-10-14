import { useQuery, UseQueryResult } from "@tanstack/react-query"
import axios from "axios"
import { Student } from "../types/Student"
import { Subject } from "../types/Subject"
import { SummaryReport } from "../types/SummaryReport"
import { Teacher } from "../types/Teacher"
import { getToken } from "./auth"

// DO ZMIANY QUERY NA BACKEND ZEBY PRZYJMOWALA PARAMSY
export const useStudents = ({
  params,
}: {
  params?: object
}): UseQueryResult<Student[]> => {
  return useQuery<Student[]>(["students"], async () => {
    await getToken()
    const { data } = await axios.get<Student[]>(`admin/student`)
    return data
  })
}

export const useTeachers = (): UseQueryResult<Teacher[]> => {
  return useQuery<Teacher[]>(["teachers"], async () => {
    await getToken()
    const { data } = await axios.get<Teacher[]>(`admin/teacher`)
    return data
  })
}

export const useSubjects = (): UseQueryResult<Subject[]> => {
  return useQuery<Subject[]>(["subjects"], async () => {
    await getToken()
    const { data } = await axios.get<Subject[]>(`admin/subject`)
    return data
  })
}

export const useReport = (): UseQueryResult<SummaryReport> => {
  return useQuery<SummaryReport>(["report"], async () => {
    await getToken()
    const { data } = await axios.get<SummaryReport>(`admin/report`)
    return data
  })
}
