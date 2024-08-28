/**
 * Property of the Metropolitan Bank & Trust Co.
 * Reuse as a whole or in part is prohibited without permission.
 * Created by the Product Engineering team/Digital Banking Division
 */
import { atom } from "jotai"

import { DayInfo, userData } from "../types"

export const showModal = atom(false)
export const userModal = atom(false)
export const modalDayData = atom<DayInfo | null>(null)

export const userDataAtom = atom<userData[]>([])
export const userNameAtom = atom<string | null>(null)
