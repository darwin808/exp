/**
 * Property of Darwin Apolinario
 */
import { atom } from "jotai"

import { DayInfo, userData } from "../types"

export const showModal = atom(false)
export const userModal = atom(false)
export const modalDayData = atom<DayInfo | null>(null)

export const userDataAtom = atom<userData[]>([])
export const userNameAtom = atom<string | null>(null)

export const loading = atom<boolean>(false)
