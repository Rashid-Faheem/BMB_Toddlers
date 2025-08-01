// type Student = {
//   id: string
//   username: string
//   name: string
//   surname: string
//   email: string
//   phone: string
//   address: string
//   sex: string
//   fcnic:string
//   mcnic: string
//   session_id:number
//   class_id:number
//   createdAt: string
// }

type sessionMaster = {
  id: number
  sessionName: string
  startDate: Date
  endDate: Date
  active: boolean
  createdAt: Date
}

type ClassMaster = {
  id: number
  class_name: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}
type paymentMonth = {
  id: number
  month_name: string
  date: Date
  active: boolean
  session_id: number | null // <-- allow null
  createdAt: Date
  updatedAt: Date
  session: {
    id: number
    sessionName: string
    startDate: Date
    endDate: Date
    active: boolean
    createdAt: Date
    updatedAt: Date
  } | null // <-- if session is optional
}

type Student = {
  id: number
  name: string
  fname: string
  mname?: string | null
  sex: 'MALE' | 'FEMALE' // or use your actual enum type
  address?: string | null
  dob?: Date | null
  contactno: string
  active: boolean
  donation: boolean
  fcnic?: string | null
  mcnic?: string | null
  session_id?: number | null
  class_id?: number | null
  createdAt: Date
  updatedAt: Date

  session?: {
    id: number
    sessionName: string
    startDate: Date
    endDate: Date
    active: boolean
    createdAt: Date
    updatedAt: Date
  } | null

  class_?: {
    id: number
    class_name: string
    active: boolean
    createdAt: Date
    updatedAt: Date
  } | null
}
