export interface JsonWebTokenInterface {
  generate(data: string): string
  // Creates a JWT containing the given data

  verify(token: string): string
  // Returns the corresponding data or fails if the token is invalid
}
