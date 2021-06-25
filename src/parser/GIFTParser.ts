import { parse } from "gift-pegjs";
import { GIFTParse } from "../types";

/**
 * Parse the text using the GIFT
 * parser.
 * @param text Cleaned input text.
 * @returns An object with either a successful parse
 * or a syntax error.
 */

export default function GIFTParser(text: string): GIFTParse {
  try {
    return [parse(text), null];
  } catch (error) {
    if (error.name === "SyntaxError") {
      return [null, [error]];
    } else {
      throw new Error(error);
    }
  }
}
