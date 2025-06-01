export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  status: number
  timestamp: string
  additionalInfo?: Record<string, object>
  totalElements?: number
}
