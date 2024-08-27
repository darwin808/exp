/**
 * Property of the Darwin Apolinario
 */
import dayjs from "dayjs"

import { DayInfo, DaysOfMonth, userData, WeekDay } from "../types"

export const getDaysOfMonth = (month: number, year: number): DaysOfMonth => {
  if (month < 1 || month > 12) {
    throw new Error("Invalid month: 1-12 only")
  }

  const days: DayInfo[] = []
  const daysInMonth = dayjs(`${year}-${month}`).daysInMonth()

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = dayjs(`${year}-${month}-${day}`)
    const dayOfWeek = currentDate.day()
    const date = currentDate.format("YYYY-MM-DD")

    const dayInfo: Omit<DayInfo, "day" | "increment"> = {
      date,
      dateOfTheDay: currentDate.date(),
      month: currentDate.month() + 1,
      year: currentDate.year()
    }

    if (dayOfWeek === 0) {
      days.push({ ...dayInfo, day: "sunday", increment: 0 })
    }
    if (dayOfWeek === 1) {
      days.push({ ...dayInfo, day: "monday", increment: 1 })
    }
    if (dayOfWeek === 2) {
      days.push({ ...dayInfo, day: "tuesday", increment: 2 })
    }
    if (dayOfWeek === 3) {
      days.push({ ...dayInfo, day: "wednesday", increment: 3 })
    }
    if (dayOfWeek === 4) {
      days.push({ ...dayInfo, day: "thursday", increment: 4 })
    }
    if (dayOfWeek === 5) {
      days.push({ ...dayInfo, day: "friday", increment: 5 })
    }
    if (dayOfWeek === 6) {
      days.push({ ...dayInfo, day: "saturday", increment: 6 })
    }
  }

  return { days }
}

export const generateDays = (month: number, year: number) => {
  if (month < 1 || month > 12) {
    throw new Error("Invalid month: 1-12 only")
  }
  const newDay = getDaysOfMonth(month, year).days

  const beforeDays = newDay[0]?.increment ?? 0

  for (let index = 0; index < beforeDays; index++) {
    newDay.unshift(null)
  }
  const defaultDays: WeekDay[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ]

  newDay.forEach((day, index) => {
    if (day === null && index < defaultDays.length) {
      newDay[index] = {
        day: defaultDays[index],
        date: "",
        increment: 0,
        dateOfTheDay: null,
        month,
        year
      }
    }
  })

  return newDay
}

export const sumValues = (data: userData[]) => {
  return data.reduce((sum, item) => {
    const value = parseFloat(item.value)
    return isNaN(value) ? sum : sum + value
  }, 0)
}
