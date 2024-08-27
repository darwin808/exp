/**
 * Property of the Darwin Apolinario
 */
import axios from "axios"
import useSWR, { mutate } from "swr"

import { userData } from "../types"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

const fetcher = async (url: string): Promise<userData[]> =>
  axiosInstance.get(url).then((res) => res.data)

export const useUserData = (username: string) => {
  const { data, error, isLoading } = useSWR(`/api?username=${username}`, fetcher)

  return {
    data,
    isLoading,
    isError: error
  }
}

export const postData = async (username: string, newData: userData) => {
  try {
    await axiosInstance.post("/api", {
      ...newData
    })
    mutate(`/api?username=${username}`)
  } catch (error) {
    console.error("Error posting data:", error)
  }
}

export const deleteData = async (id: number, username: string) => {
  try {
    await axiosInstance.delete(`/api/${id}`)

    mutate(`/api?username=${username}`)
  } catch (error) {
    console.error("Error deleting data:", error)
    throw error
  }
}
