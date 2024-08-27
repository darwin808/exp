/**
 * Property of the Metropolitan Bank & Trust Co.
 * Reuse as a whole or in part is prohibited without permission.
 * Created by the Product Engineering team/Digital Banking Division
 */

import {
  AccountIcon,
  BellIcon,
  MagnifyLargeIcon,
  MagnifySmallIcon,
  MetrobankIcon,
  SmileyIcon
} from "@ui/assets"
import dayjs from "dayjs"
import { memo } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from ".."

const Main = ({ time }: { time: string }) => {
  // TODO: change implementation when API is available
  const getUser = sessionStorage.getItem("account")
  const parseUser: {
    email: string
    firstName: string
    lastName: string
    type: string
    branch: string
  } = JSON.parse(getUser!)
  return (
    <div className="flex-col w-full">
      <div className="w-full h-[72px] bg-gradient-to-l from-[#001A88] to-[#059ED8] flex flex-grow flex-row px-4">
        <div className="flex flex-1 flex-row items-center font-sans text-white gap-2">
          <MetrobankIcon />
          UX40
        </div>
        <div className="flex flex-row items-center gap-2 font-sans text-white">
          <div>{parseUser.type}</div>
          <div>&#x2022;</div>
          <div>{`${parseUser.firstName} ${parseUser.lastName}`}</div>
          <div>&#x2022;</div>
          <div>{parseUser.branch}</div>
          <AccountIcon />
          <BellIcon />
        </div>
      </div>
      <div className="flex flex-row items-center bg-white p-6 border-b border-[#e7e7e7] w-full">
        <div className="flex-col gap-2 flex-1">
          <div className="flex flex-row gap-1 font-thin text-base">
            <div>Hello, {parseUser.firstName}</div>
            <SmileyIcon />
          </div>
          <div>Select a task to perform.</div>
        </div>
        <div className="flex flex-row items-center gap-6">
          <div>{dayjs().format("MMMM DD, YYYY")}</div>
          <div className="rounded-[8px] bg-[#f2fafd] p-3">{time}</div>
        </div>
      </div>
      <div className="w-full flex flex-row items-center py-6 border-b border-[#e7e7e7]">
        <div className="flex flex-1 flex-col gap-4 pl-6 pr-8 border-r border-[#c7c7c7]">
          <div className="flex flex-row items-center justify-between">
            <div className="text-base font-sans text-[#777777]">SEARCH</div>
            <div className="text-sm font-sans text-[#777777]">Advanced search</div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Select>
              <SelectTrigger className="bg-white py-6 px-2 rounded-sm border border-[#d7d7d7] w-[179px] max-w-[200px] font-sans text-base text-[#575757]">
                <SelectValue placeholder="ARN" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="flex flex-row gap-4 p-4">
                  <div className="flex flex-col">
                    <SelectLabel className="font-sans text-xs text-[#777777]">
                      TRANSACTION
                    </SelectLabel>
                    <SelectItem className="font-sans text-base text-[#000000]" value="trn">
                      TRN
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="transaction-brn"
                    >
                      Transaction BRN
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="transaction-amount"
                    >
                      Transaction amount
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="transaction-account-number"
                    >
                      Account number
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="transaction-account-name"
                    >
                      Account name
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="transaction-maker"
                    >
                      Maker
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="transaction-checker"
                    >
                      checker
                    </SelectItem>
                  </div>
                  <div className="flex flex-col">
                    <SelectLabel className="font-sans text-xs text-[#777777]">
                      APPLICATION
                    </SelectLabel>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="application-arn"
                    >
                      ARN
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="application-brn"
                    >
                      Application BRN
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="application-account-name"
                    >
                      Account name
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="application-account-number"
                    >
                      Account number
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="application-product-type"
                    >
                      Product type
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="application-rm-number"
                    >
                      RM number
                    </SelectItem>
                    <SelectItem
                      className="font-sans text-base text-[#000000]"
                      value="application-risk-code"
                    >
                      Risk code
                    </SelectItem>
                  </div>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="bg-white py-3 px-4 rounded-sm border border-[#d7d7d7] flex flex-1 flex-row gap-2 items-center">
              <MagnifySmallIcon />
              <div className="font-sans text-base text-[#a7a7a7]">Enter ARN</div>
            </div>
            <button className="bg-[#104777] rounded-full py-3 px-8">
              <MagnifyLargeIcon />
            </button>
          </div>
        </div>
        <div className="pl-8 pr-6">
          <Sheet>
            <SheetTrigger>
              <button
                // onClick={() => setOpenSheet(true)}
                className="bg-[#104777] flex flex-row items-center gap-2 rounded-full py-4 px-8 font-sans text-sm text-white"
              >
                <div>Create a transaction</div>
                <div>+</div>
              </button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] m-0 p-0">
              <SheetHeader>
                <SheetTitle className="text-base font-sans text-[#777777] m-4">
                  CREATE NEW TRANSACTION
                </SheetTitle>
              </SheetHeader>
              <button className="flex flex-row place-content-between border-b p-4 border-gray-300 w-full hover:bg-[#f2fafd]">
                <div className="text-[#104777] font-semibold">Cash Deposit</div>
                <div className="text-[#104777] font-semibold text-base">+</div>
              </button>
              <button className="flex flex-row place-content-between border-b p-4 border-gray-300 w-full hover:bg-[#f2fafd]">
                <div className="text-[#104777] font-semibold">Cash Withdrawal</div>
                <div className="text-[#104777] font-semibold text-base">+</div>
              </button>
              <button className="flex flex-row place-content-between border-b p-4 border-gray-300 w-full hover:bg-[#f2fafd]">
                <div className="text-[#104777] font-semibold">Check Deposit</div>
                <div className="text-[#104777] font-semibold text-base">+</div>
              </button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

export const Header = memo(Main)
