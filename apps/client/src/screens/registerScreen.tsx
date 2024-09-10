/**
 * Property of Darwin Apolinario
 */
import { useEffect } from "react"

import { useVerify } from "../api"
import { SignupForm } from "../components"

export const RegisterScreen = () => {
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
    <div className="absolute inset-0 flex justify-center items-center bg-gray-200">
      <SignupForm />
    </div>
  )
}
