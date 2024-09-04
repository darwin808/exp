/**
 * Property of Darwin Apolinario
 */
export type WeekDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"

export type DayInfo = {
  date: string
  day: WeekDay
  increment: number
  dateOfTheDay: number | null
  month: number
  year: number
  data?: string[]
}

export type DaysOfMonth = {
  days: (DayInfo | null)[]
}

export type userData = {
  username?: string
  date: string
  value: string
  item_id?: number
  description?: string
}

type User = {
  id: number
  email: string
  username: string
  total_value: string // If it's a string, keep it as a string
}

export type VerifyResponse = {
  message: string
  user: User
  login: boolean
}
