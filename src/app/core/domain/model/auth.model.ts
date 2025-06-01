export interface Login {
  email: string
  code: string
}

export interface TokenData {
  accessToken: string
  refreshToken: string
}

export interface TokenRefreshData {
  newAccessToken: string
  newRefreshToken: string
}
