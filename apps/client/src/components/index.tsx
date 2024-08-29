/**
 * Property of Darwin Apolinario
 */
import dayjs from "dayjs"
import { useAtomValue, useSetAtom } from "jotai"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"

import { deleteData, login, postData, register } from "../api"
import { COLORS } from "../constants"
import { modalDayData, showModal, userDataAtom } from "../store"
import { DayInfo } from "../types"
import { sumValues } from "../utils"

export { Modal } from "./modal"

type Props = {
  days: (DayInfo | null)[]
  start: number
  end: number
  headerColumn?: boolean
}

export const MonthRow = ({ days, start, end, headerColumn = false }: Props) => {
  const setModalData = useSetAtom(modalDayData)
  const setShowModal = useSetAtom(showModal)
  const userData = useAtomValue(userDataAtom)

  const handleDayClick = (e: DayInfo) => {
    if (e?.date) {
      setModalData(e)
      setShowModal(true)
    }
  }
  return (
    <div className="flex flex-row ">
      {days?.slice(start, end)?.map((e: DayInfo | null, i: number) => {
        const currentDate = dayjs().format("YYYY-MM-DD")
        const isDateToday = currentDate === e?.date

        const isWeekend = e?.day === "sunday" || e?.day === "saturday"
        return (
          <div
            onClick={(event) => {
              event.stopPropagation()
              if (e) {
                handleDayClick(e)
              }
            }}
            key={i}
            className={`m-1 hover:shadow-xl  hover:bg-gray-200 transition-all size-32 ring-1 ring-gray-100 rounded-lg   ${isDateToday ? "bg-gray-300" : "bg-transparent"}`}
          >
            {headerColumn && <span className=" p-2 text-center text-sm">{e?.day}</span>}

            <h1
              className="text-center text-2xl"
              style={{
                fontWeight: isDateToday ? "900" : "400",
                color: isWeekend ? "red" : "#333333"
              }}
            >
              {e?.dateOfTheDay}
            </h1>
            <div className="px-1 flex w-full flex-wrap gap-1">
              {userData.map((x, i: number) => {
                const id = `react-tooltip-${x.item_id}`
                if (x.date === e?.date) {
                  return (
                    <button
                      id={id}
                      key={i}
                      className="flex px-1 py-0.5 text-[8px] justify-between border min-w-14 rounded-sm hover:opacity-80 transition-all font-bold"
                      style={{
                        color: x.value.includes("-") ? COLORS.red : COLORS.green,
                        borderColor: x.value.includes("-") ? COLORS.red : COLORS.green
                      }}
                    >
                      {x.value}
                      <ReactTooltip anchorSelect={"#" + id} content={x?.description ?? ""} />
                      <button
                        onClick={(event) => {
                          event.stopPropagation()
                          deleteData(x?.item_id ?? 0)
                        }}
                      >
                        X
                      </button>
                    </button>
                  )
                }
                return null
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

type headerCompProps = {
  currentDay: number
  currentYear: number
  currentMonth: number
  setCurrentYear: (e: number) => void
  setCurrentMonth: (e: number) => void
}

export const HeaderComp = ({
  currentMonth,
  currentYear,
  currentDay,
  setCurrentMonth,
  setCurrentYear
}: headerCompProps) => {
  const [showMoney, setShowMoney] = useState(false)

  const userData = useAtomValue(userDataAtom)
  const totalMoney = sumValues(userData)

  const date = dayjs(`${currentMonth}/${currentDay}/${currentYear}`)
  const formattedDate = date.format("MMMM YYYY")

  const money = Number(totalMoney.toFixed(2)).toLocaleString()
  const finalMoney = showMoney ? money : "*******"

  return (
    <header className="flex justify-between p-2">
      <div>
        <h1 className="w-96 text-4xl">{formattedDate}</h1>

        <div className="flex gap-4">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center rounded-full px-8 py-2 text-center"
            onClick={() => {
              if (currentMonth <= 1) {
                setCurrentMonth(12)
                setCurrentYear(currentYear - 1)
              } else {
                setCurrentMonth(currentMonth - 1)
              }
            }}
          >
            Previous
          </button>

          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center rounded-full px-10 py-2 text-center"
            onClick={() => {
              if (currentMonth >= 12) {
                setCurrentMonth(1)
                setCurrentYear(currentYear + 1)
              } else {
                setCurrentMonth(currentMonth + 1)
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex  w-full justify-end  px-4">
        <div className="flex h-full w-64  justify-between  items-center rounded-lg border-2 border-black bg-yellow-100 px-2 text-center text-4xl transition-all  hover:bg-yellow-100/80">
          <h1>$ {finalMoney}</h1>
          <button
            onClick={() => {
              setShowMoney(!showMoney)
            }}
          >
            {!showMoney ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
    </header>
  )
}

export const ModalForm = ({ data }: { data: DayInfo | null }) => {
  const [loading, setLoading] = useState(false)
  const [val, setVal] = useState("")
  const [description, setDescription] = useState("")
  const formattedDate = dayjs(data?.date).format("YYYY-MM-DDTHH:mm:ss")
  const setShowModal = useSetAtom(showModal)

  const payload = {
    date: formattedDate,
    value: val,
    description
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!loading && val && description) {
      setLoading(true)

      await postData(payload)
      setVal("")
      setShowModal(false)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex">
      <div className="flex flex-col">
        <input
          autoFocus
          placeholder="enter a number"
          type="text"
          value={val}
          onChange={(e) => {
            setVal(e.currentTarget.value)
          }}
        />
        <input
          placeholder="Description"
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.currentTarget.value)
          }}
        />
      </div>
      <button type="submit" className="bg-red-50 p-2" disabled={loading}>
        submit
      </button>
    </form>
  )
}

export const ModalLoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const setShowModal = useSetAtom(showModal)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await login({ username, password })
    if (res.token) {
      window.localStorage.setItem("token", res.token)

      setShowModal(false)
      window.location.replace("/")
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <input
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.currentTarget.value)
        }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value)
        }}
      />
      <button type="submit">submit</button>
    </form>
  )
}

export const SignupForm = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await register({ username, password, email })
    if (res.token) {
      window.localStorage.setItem("token", res.token)

      window.location.replace("/")
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <input
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.currentTarget.value)
        }}
      />
      <input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.currentTarget.value)
        }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value)
        }}
      />
      <button type="submit">submit</button>
    </form>
  )
}
