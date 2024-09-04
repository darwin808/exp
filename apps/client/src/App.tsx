/**
 * Property of Darwin Apolinario
 */
import dayjs from "dayjs"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { Outlet, Route, Routes } from "react-router-dom"

import { useUserData, useVerify } from "./api"
import { HeaderComp, Modal, ModalForm, MonthRow } from "./components"
import { RegisterScreen } from "./screens"
import { LoginScreen } from "./screens/loginScreen"
import { modalDayData, userDataAtom } from "./store"
import { DayInfo } from "./types"
import { generateDays } from "./utils"

const App = () => {
  const userData = useUserData()
  const verify = useVerify()

  const [currentMonth, setCurrentMonth] = useState(dayjs().month() + 1)
  const [currentYear, setCurrentYear] = useState(dayjs().year())
  const [daysOfTheMonth, setDaysOfTheMonth] = useState<(DayInfo | null)[]>([null])

  const currentDay = dayjs().date()
  const modalData = useAtomValue(modalDayData)
  const setUserData = useSetAtom(userDataAtom)

  const headerCompProps = {
    currentDay,
    currentYear,
    currentMonth,
    setCurrentYear,
    setCurrentMonth,
    totalValue: verify?.data?.user?.total_value
  }

  useEffect(() => {
    setDaysOfTheMonth(generateDays(currentMonth, currentYear))
  }, [currentMonth, currentYear])

  useEffect(() => {
    if (userData.data) {
      const newRes = userData?.data?.map((e) => {
        const date = dayjs(e.date).format("YYYY-MM-DD")
        return { ...e, date }
      })

      setUserData(newRes)
    }
  }, [userData?.data, setUserData])

  return (
    <>
      <Modal>
        <ModalForm data={modalData} />
      </Modal>
      <div className="font-Regular h-auo w-screen  bg-white">
        <HeaderComp {...headerCompProps} />
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

          <div className="flex size-full flex-col">
            <MonthRow days={daysOfTheMonth} start={0} end={7} headerColumn={true} />
            <MonthRow days={daysOfTheMonth} start={7} end={14} />
            <MonthRow days={daysOfTheMonth} start={14} end={21} />
            <MonthRow days={daysOfTheMonth} start={21} end={28} />
            <MonthRow days={daysOfTheMonth} start={28} end={35} />
          </div>
        </div>
      </div>
    </>
  )
}

const Layout = () => {
  return (
    <div className="">
      <Outlet />
    </div>
  )
}

const AppRoutes = () => {
  const verify = useVerify()
  let authRoutes = (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route path="*" element={<App />} />
      </Route>
    </Routes>
  )

  if (!verify.data ?? verify.isLoading) {
    authRoutes = (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="*" element={<LoginScreen />} />
        </Route>
      </Routes>
    )
  }

  return authRoutes
}
export default AppRoutes
