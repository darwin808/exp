/**
 * Property of the Darwin Apolinario
 */
import dayjs from "dayjs"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"

import { useUserData } from "./api"
import { HeaderComp, Modal, ModalForm, ModalUserForm, MonthRow } from "./components"
import { modalDayData, showModal, userDataAtom, userNameAtom } from "./store"
import { DayInfo } from "./types"
import { generateDays } from "./utils"

const App = () => {
  const setUserName = useSetAtom(userNameAtom)
  const username = window.localStorage.getItem("username")
  const { data: userData, isLoading, isError } = useUserData(username ?? "")

  const [currentMonth, setCurrentMonth] = useState(dayjs().month() + 1)
  const [currentYear, setCurrentYear] = useState(dayjs().year())
  const [daysOfTheMonth, setDaysOfTheMonth] = useState<(DayInfo | null)[]>([null])

  const currentDay = dayjs().date()
  const modalData = useAtomValue(modalDayData)
  const setShowModal = useSetAtom(showModal)
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
    if (userData) {
      const newRes = userData?.map((e) => {
        const date = dayjs(e.date).format("YYYY-MM-DD")
        return { ...e, date }
      })

      setUserData(newRes)
    }
  }, [userData, setUserData])

  useEffect(() => {
    setUserName(username)
  }, [username, setUserName])

  useEffect(() => {
    if (!username) {
      setShowModal(true)
    }
  }, [username, setShowModal])

  if (isLoading) {
    return <div>loading</div>
  }

  // if (isError) {
  //   return <div>ERROR</div>
  // }

  return (
    <>
      {!username ? (
        <Modal>
          <ModalUserForm />
        </Modal>
      ) : (
        <Modal>
          <ModalForm data={modalData} />
        </Modal>
      )}

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

export default App
