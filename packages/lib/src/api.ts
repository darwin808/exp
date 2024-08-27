/**
 * Property of the Metropolitan Bank & Trust Co.
 * Reuse as a whole or in part is prohibited without permission.
 * Created by the Product Engineering team/Digital Banking Division
 */

import { api } from "@repo/config"
import axios, { AxiosResponse } from "axios"

const http = axios.create({
  baseURL: api.baseUrl,
  timeout: api.timeout,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true
  }
})

export const handleRequest = async (responseData: AxiosResponse) => {
  // do something like logger here
  return responseData
}

export const handleRejectedRequest = async (err: { message: string }) => {
  const { message } = err
  const rejectExceptions = ["timeout", "Network Error", "404", "500"]
  const shouldReject = !rejectExceptions.some((m) => message.includes(m))
  if (shouldReject) {
    return Promise.reject(err)
  }
}

http.interceptors.response.use(handleRequest, handleRejectedRequest)

export { http }
