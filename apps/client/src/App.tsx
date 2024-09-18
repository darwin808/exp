/**
 * Property of Darwin Apolinario
 */

import dayjs from "dayjs"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Outlet, Route, Routes } from "react-router-dom"

import { useUserData, useVerify } from "./api"
import { HeaderComp, LeftNav, Modal, ModalForm, RightBody } from "./components"
import { RegisterScreen } from "./screens"
import { LoginScreen } from "./screens/loginScreen"
import { modalDayData, userDataAtom } from "./store"
import { DaysOfTheMonth, Verify } from "./types"
import { generateDays } from "./utils"

const App = () => {
  const userData = useUserData()
  const verify: Verify = useVerify()

  const [currentMonth, setCurrentMonth] = useState(dayjs().month() + 1)
  const [currentYear, setCurrentYear] = useState(dayjs().year())
  const [daysOfTheMonth, setDaysOfTheMonth] = useState<DaysOfTheMonth>([null])

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
      <main className="font-Regular h-screen w-screen  bg-white">
        <header className="header flex  w-full h-32 border-b-2">
          <ErrorBoundary fallback={<div>error</div>}>
            <HeaderComp {...headerCompProps} />
          </ErrorBoundary>
        </header>
        <section className="body flex flex-row w-full h-full ">
          <ErrorBoundary fallback={<div>error</div>}>
            <nav className="left_body w-1/4 h-full border-r-2">
              <LeftNav verify={verify} />
            </nav>
          </ErrorBoundary>

          <div className="right_body w-3/4 h-full flex justify-center align-center">
            <ErrorBoundary fallback={<div>error</div>}>
              <RightBody daysOfTheMonth={daysOfTheMonth} />
            </ErrorBoundary>
          </div>
        </section>
      </main>
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
