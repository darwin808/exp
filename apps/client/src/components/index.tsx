/**
 * Property of Darwin Apolinario
 */
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { useAtomValue, useSetAtom } from "jotai"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip as ReactTooltip } from "react-tooltip"
import { z } from "zod"

import { deleteData, login, postData, register } from "../api"
import { COLORS } from "../constants"
import { modalDayData, showModal, userDataAtom } from "../store"
import { DayInfo, DaysOfTheMonth, Verify } from "../types"
import { Button } from "./button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Input } from "./input"

export * from "./form"
export { Modal } from "./modal"

type Props = {
  days: (DayInfo | null)[]
  start: number
  end: number
  headerColumn?: boolean
}

const Xicon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
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
            style={{ width: "150px", height: "130px" }}
            onClick={(event) => {
              event.stopPropagation()
              if (e) {
                handleDayClick(e)
              }
            }}
            key={i}
            className={`m-1 hover:shadow-xl   transition-all  ring-1 ring-gray-100 rounded-lg   ${isDateToday ? "border-2 border-red-600 bg-red-50 bg-opacity-25 " : "border-0 bg-transparent hover:bg-gray-200"}`}
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
                    <div
                      style={{
                        borderColor: x.value.includes("-") ? COLORS.red : COLORS.green
                      }}
                      className="flex px-1 py-0.5 text-[8px] justify-between border   rounded-sm hover:opacity-80 transition-all font-bold"
                    >
                      <button
                        id={id}
                        key={i}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        style={{
                          color: x.value.includes("-") ? COLORS.red : COLORS.green,
                          borderColor: x.value.includes("-") ? COLORS.red : COLORS.green
                        }}
                      >
                        {x.value}
                        <ReactTooltip anchorSelect={"#" + id} content={x?.description ?? ""} />
                      </button>
                      <div className="w-1"></div>

                      <button
                        title="remove item"
                        onClick={(event) => {
                          event.stopPropagation()
                          deleteData(x?.item_id ?? 0)
                        }}
                      >
                        <Xicon />
                      </button>
                    </div>
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
  totalValue?: number
}

export const HeaderComp = ({
  currentMonth,
  currentYear,
  currentDay,
  setCurrentMonth,
  setCurrentYear,
  totalValue = 0
}: headerCompProps) => {
  const [showMoney, setShowMoney] = useState(false)

  const date = dayjs(`${currentMonth}/${currentDay}/${currentYear}`)
  const formattedDate = date.format("MMMM YYYY")

  const finalMoney = showMoney ? totalValue : "*******"

  return (
    <header className="flex justify-between py-2 px-4  w-full">
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
        <div className="flex h-full w-72  justify-between  items-center rounded-lg border-2 border-black bg-yellow-100 px-2 text-center text-4xl transition-all  hover:bg-yellow-100/90">
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

const formSchema = z.object({
  val: z.coerce.number(),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters."
  })
})

export const ModalForm = ({ data }: { data: DayInfo | null }) => {
  const [loading, setLoading] = useState(false)
  const formattedDate = dayjs(data?.date).format("YYYY-MM-DDTHH:mm:ss")
  const setShowModal = useSetAtom(showModal)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const payload = {
      date: formattedDate,
      value: String(values.val),
      description: values.description
    }
    if (values.val) {
      await postData(payload)
    }

    setLoading(false)
    setShowModal(false)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96">
        <FormField
          control={form.control}
          name="val"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Amount" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

const loginSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(2, {
    message: "Description must be at least 2 characters."
  })
})

const LoadingSpinner = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`.spinner {
          transform-origin: center;
          animation: spinner 0.75s infinite linear;
        }
        @keyframes spinner {
          100% {
            transform: rotate(360deg);
          }
        }
      `}
      </style>
      {/* Lightened the color */}
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        fill="rgba(255, 255, 255, 0.3)"
      />
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        className="spinner"
        fill="#fff"
      />
    </svg>
  )
}
export const ModalLoginForm = () => {
  const [loading, setLoading] = useState(false)
  const setShowModal = useSetAtom(showModal)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {}
  })
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setLoading(true)
      const { username, password } = values
      const res = await login({ username, password })
      if (res.token) {
        window.localStorage.setItem("token", res.token)

        setShowModal(false)
        window.location.replace("/")
      }
      setShowModal(false)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setShowModal(false)
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white space-y-8 w-96 shadow-2xl  p-6 rounded-xl"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Username" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-20" disabled={loading}>
          {loading ? <LoadingSpinner /> : "Submit"}
        </Button>
      </form>
    </Form>
  )
}

const registerSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters."
  }),
  email: z.string().email().min(2)
})
export const SignupForm = () => {
  const [loading, setLoading] = useState(false)
  const setShowModal = useSetAtom(showModal)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {}
  })
  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      setLoading(true)
      const { username, password, email } = values

      const res = await register({ username, password, email })
      if (res.token) {
        window.localStorage.setItem("token", res.token)

        window.location.replace("/")
      }

      setShowModal(false)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setShowModal(false)
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white space-y-2 w-96 shadow-2xl  p-6 rounded-xl"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Email" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export const LeftNav = ({ verify }: { verify: Verify }) => {
  return (
    <div className="flex flex-row">
      <div className="h-full w-60">
        <h1 className="w-96 text-xl">Hello {verify?.data?.user?.username}</h1>
        <button
          className="bg-red-400 rounded-full px-2 text-xs py-1"
          onClick={() => {
            window.localStorage.removeItem("token")
            window.location.replace("/login")
          }}
        >
          Log out
        </button>
      </div>
    </div>
  )
}

export const RightBody = ({ daysOfTheMonth }: { daysOfTheMonth: DaysOfTheMonth }) => {
  return (
    <div className="flex size-full flex-col">
      <MonthRow days={daysOfTheMonth} start={0} end={7} headerColumn={true} />
      <MonthRow days={daysOfTheMonth} start={7} end={14} />
      <MonthRow days={daysOfTheMonth} start={14} end={21} />
      <MonthRow days={daysOfTheMonth} start={21} end={28} />
      <MonthRow days={daysOfTheMonth} start={28} end={35} />
    </div>
  )
}
