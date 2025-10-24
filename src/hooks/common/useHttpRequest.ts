import axios from "axios"
import { useState } from "react"

const useHttpRequest = () => {
  const [isLoading, setIsLoading] = useState(false)

  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_API_KEY,
    },
  })

  const get = async <T = unknown>(url: string): Promise<T | undefined> => {
    try {
      setIsLoading(true)
      const response = await client.get(url)
      return response.data
    } catch (error) {
      throw error as Error
    } finally {
      setIsLoading(false)
    }
  }

  const post = async <T, R = unknown>(url: string, data: T): Promise<R | undefined> => {
    try {
      setIsLoading(true)
      const response = await client.post(url, data)
      return response.data
    } catch (error) {
      throw error as Error
    } finally {
      setIsLoading(false)
    }
  }
  return { isLoading, get, post, client }
}

export default useHttpRequest