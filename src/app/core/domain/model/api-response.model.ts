export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  status: number
  timestamp: string
  additional?: {
    pagination?: {
      totalElements: number
      totalPages: number
      size: number
      pageNumber: number
    }
    [key: string]: unknown
  }
}
