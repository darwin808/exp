/**
 * Property of Darwin Apolinario
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
