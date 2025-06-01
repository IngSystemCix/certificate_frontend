export interface JwtPayload {
  fullName: string
  roles: string
  sub: string
  iat: number
  exp: number
}
