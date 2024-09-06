/**
 * Property of Darwin Apolinario
 */
import axios from "axios"
import useSWR, { mutate } from "swr"

import { userData, VerifyResponse } from "../types"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("token")
  }
})

const fetcher = async (url: string): Promise<userData[]> =>
  axiosInstance.get(url).then((res) => res.data)

export const useUserData = () => {
  const { data, error, isLoading } = useSWR<userData[]>(`/api`, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}

const fetcherVerify = async (url: string): Promise<VerifyResponse> =>
  axiosInstance.get(url).then((res) => res.data)

export const useVerify = () => {
  const { data, error, isLoading } = useSWR<VerifyResponse>(
    window.localStorage.getItem("token") ? "/verify" : null,
    fetcherVerify
  )

  return {
    data,
    isLoading,
    isError: !!error
  }
}

type LoginBody = {
  username: string
  password: string
}

type RegisterBody = {
  username: string
  password: string
  email: string
}
export const login = async (body: LoginBody) => {
  try {
    const res = await axiosInstance.post("/login", {
      ...body
    })
    return res.data
  } catch (error) {
    console.error("Error posting data:", error)
  }
}
export const register = async (body: RegisterBody) => {
  try {
    const res = await axiosInstance.post("/register", {
      ...body
    })
    return res.data
  } catch (error) {
    console.error("Error posting data:", error)
  }
}

export const postData = async (newData: userData) => {
  try {
    await axiosInstance.post("/api", {
      ...newData
    })
    mutate(`/api`)
    mutate(`/verify`)
  } catch (error) {
    console.error("Error posting data:", error)
  }
}

export const deleteData = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/${id}`)

    mutate(`/api`)
    mutate(`/verify`)
  } catch (error) {
    console.error("Error deleting data:", error)
    throw error
  }
}
