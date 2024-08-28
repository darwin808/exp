/**
 * Property of the Darwin Apolinario
 */
import dayjs from "dayjs"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"

import { useUserData, useVerify } from "./api"
import { HeaderComp, Modal, ModalForm, MonthRow } from "./components"
import { modalDayData, userDataAtom } from "./store"
import { DayInfo } from "./types"
import { generateDays } from "./utils"
import { Routes, Route, Outlet } from "react-router-dom"
import { LoginScreen } from "./screens/loginScreen"
import { RegisterScreen } from "./screens"

const App = () => {
  const userData = useUserData()

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
    setCurrentMonth
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

  if (userData.isLoading) {
    return <div>loading</div>
  }

  return (
    <>
      <Modal>
        <ModalForm data={modalData} />
      </Modal>
      <div className="font-Regular h-screen w-screen overflow-hidden bg-white">
        <HeaderComp {...headerCompProps} />
        <div className="flex flex-row">
          <div className="h-full w-96"></div>

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
