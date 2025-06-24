import { customAlphabet } from "nanoid";

const tokenCharacters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Generates a unique token using a custom nanoid alphabet.
 *
 * @param length - The desired length of the generated token
 * @returns A unique random string token of specified length
 */
export function createNanoidToken(length: number): string {
  const nanoid = customAlphabet(tokenCharacters, length);
  return nanoid();
}
