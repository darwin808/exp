/**
 * Property of the Metropolitan Bank & Trust Co.
 * Reuse as a whole or in part is prohibited without permission.
 * Created by the Product Engineering team/Digital Banking Division
 */
import { useEffect } from "react"

import { useVerify } from "../api"
import { ModalLoginForm } from "../components"

export const LoginScreen = () => {
  const verify = useVerify()

  useEffect(() => {
    if (verify.data && !verify.isLoading) {
      window.location.replace("/")
    }
  }, [verify.data])

  if (verify.isLoading) {
    return <div>loading</div>
  }

  return (
    <div>
      Login
      <ModalLoginForm />
    </div>
  )
}
