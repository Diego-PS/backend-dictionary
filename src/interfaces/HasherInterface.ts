export interface HasherInterface {
  hash(message: string): Promise<string>
  // Takes a message, hashes it and return the hashed value

  compare(message: string, hashed: string): Promise<boolean>
  // Returns true if the hashed argument correspondes to the message
}
