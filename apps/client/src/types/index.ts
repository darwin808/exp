/**
 * Property of the Metropolitan Bank & Trust Co.
 * Reuse as a whole or in part is prohibited without permission.
 * Created by the Product Engineering team/Digital Banking Division
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
