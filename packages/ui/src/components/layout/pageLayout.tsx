/**
 * Property of the Metropolitan Bank & Trust Co.
 * Reuse as a whole or in part is prohibited without permission.
 * Created by the Product Engineering team/Digital Banking Division
 */
import React, { memo } from "react"

type Props = {
  children: React.ReactNode
}

const Main: React.FC<Props> = ({ children }) => {
  return <div className="bg-[#f7f7f7] size-full">{children}</div>
}

export const PageLayout = memo(Main)
