import {
  Box,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  NumberInput,
  TextInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import axios, { AxiosError } from "axios"
import React, { FunctionComponent, useState } from "react"
import { signOut } from "../../services/auth"
import { Subject } from "../../types/Subject"

export type SubjectFormType = {
  name: string
  lessonLength: number
  classRange: string[]
  mandatory: boolean
  instrumentRelated: boolean
}

type SubjectCreateType = {
  name: string
  lessonLength: number
  classRange: number[]
  mandatory: boolean
  instrumentRelated: boolean
  itn: boolean
}
interface IProps {
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
  isAdding: boolean
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
}

export const SubjectForm: FunctionComponent<IProps> = ({
  setSubjects,
  isAdding,
  setIsAdding,
}) => {
  const [classNumber] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ])

  const subjectForm = useForm<SubjectFormType>({
    initialValues: {
      name: "",
      lessonLength: 45,
      classRange: [],
      mandatory: false,
      instrumentRelated: false,
    },

    validate: () => ({}),
  })

  // const notificationObject = {
  //   title: `${
  //     error ? `Nie udało się dodać przedmiotu!` : "Udało się dodać przedmiot!"
  //   }`,
  //   autoClose: 3000,
  //   icon: error?.length > 0 ? <X size={18} /> : <Check size={18} />,
  //   color: error?.length > 0 ? "red" : "green",
  //   message: error
  //     ? `Nie udało się dodać przedmiotu ${subjectForm.values.name}`
  //     : `Udało się dodać przedmiot ${subjectForm.values.name}`,
  // }

  const handleSubmit = async (subjectData: SubjectFormType) => {
    try {
      setIsAdding(!isAdding)
      const payload: SubjectCreateType = {
        ...subjectData,
        classRange: subjectData.classRange.map((classNum) => {
          return parseInt(classNum)
        }),
        itn: true,
      }
      await axios.post(`admin/subject`, payload)
      await fetchSubjects()
    } catch (error) {
      setIsAdding(!isAdding)
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
    setIsAdding(!isAdding)
    // TODO: error handling (notifaction)
  }

  const fetchSubjects = async () => {
    try {
      const subjectResponse = await axios.get<Subject[]>(`admin/subject`)
      setSubjects(subjectResponse.data)
    } catch (error) {
      const aError = error as AxiosError
      if (aError.response?.status === 401) {
        await signOut()
      }
    }
  }

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={subjectForm.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Nazwa zajęć"
          placeholder="nazwa"
          {...subjectForm.getInputProps("name")}
        />

        <NumberInput
          required
          defaultValue={45}
          min={5}
          max={300}
          step={5}
          placeholder="długość zajęć"
          label="Długość zajęć"
          {...subjectForm.getInputProps("lessonLength")}
        />

        <MultiSelect
          required
          label="Wybierz klase"
          placeholder="klasa"
          data={classNumber}
          searchable
          {...subjectForm.getInputProps("classRange")}
        />

        <Checkbox
          mt={10}
          label="Przedmiot obowiązkowy"
          {...subjectForm.getInputProps("mandatory")}
        />

        <Checkbox
          mt={10}
          label="Dotyczący instrumentu"
          {...subjectForm.getInputProps("instrumentRelated")}
        />

        <Group position="right" mt="md">
          <Button color="dark" type="submit">
            Dodaj Przedmiot
          </Button>
        </Group>
      </form>
    </Box>
  )
}
